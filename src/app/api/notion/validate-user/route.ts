import { NextResponse } from 'next/server';
import { searchContact, logEvent } from '@/lib/n8n';

export async function POST(request: Request) {
    let cleanPhone = '';
    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
        }

        // Normalize phone: remove spaces, dots, dashes
        cleanPhone = phone.replace(/[\s\.\-]/g, '');

        console.log('Validating phone via n8n:', cleanPhone);

        const n8nResult = await searchContact(cleanPhone);

        // Log the search attempt
        await logEvent('Search Contact', cleanPhone, 'Success', n8nResult);

        // n8n might return the contact directly or in an array, or with a exists flag
        // We'll adapt to a common n8n pattern: an array of results or a single object.
        const contact = Array.isArray(n8nResult) ? n8nResult[0] : (n8nResult.contact || n8nResult);

        // Extract ID
        const contactId = contact?.id || contact?.PageId;

        // Extract Name
        let name = contact?.name || contact?.Nombre || contact?.['Nombre completo'];
        if (typeof name === 'object' && name?.title && Array.isArray(name.title)) {
            // Notion Title Property
            name = name.title[0]?.plain_text || '';
        } else if (typeof name === 'object' && name?.rich_text && Array.isArray(name.rich_text)) {
            // Notion Rich Text Property
            name = name.rich_text[0]?.plain_text || '';
        }

        // Extract Email
        let email = contact?.email || contact?.Email;
        if (typeof email === 'object' && email?.email) {
            // Notion Email Property
            email = email.email;
        }

        if (contactId) {
            return NextResponse.json({
                exists: true,
                user: {
                    id: contactId,
                    name: name || '',
                    email: email || '',
                    phone: cleanPhone
                }
            });
        }

        return NextResponse.json({ exists: false });

    } catch (error: any) {
        console.error('Validation Error:', error);
        await logEvent('Search Contact Error', cleanPhone || 'unknown', 'Error', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
