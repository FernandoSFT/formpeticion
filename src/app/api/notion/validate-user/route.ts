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
        const name = contact?.name || contact?.Nombre || contact?.['Nombre completo'] || '';
        const contactId = contact?.id || contact?.PageId;

        if (contactId && name) {
            return NextResponse.json({
                exists: true,
                user: {
                    id: contactId,
                    name,
                    email: contact.email || contact.Email || '',
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
