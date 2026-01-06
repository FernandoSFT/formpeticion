import { NextResponse } from 'next/server';
import { searchContact, logEvent } from '@/lib/n8n';

export async function POST(request: Request) {
    let cleanPhone = ''; // Este se queda como 'let' porque se reasigna abajo

    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
        }

        // Normalizamos el teléfono
        cleanPhone = phone.replace(/[\s\.\-]/g, '');

        console.log('Validating phone via n8n:', cleanPhone);

        const n8nResult = await searchContact(cleanPhone);

        // Log del intento de búsqueda
        await logEvent('Search Contact', cleanPhone, 'Success', n8nResult);

        const contact = Array.isArray(n8nResult) ? n8nResult[0] : (n8nResult.contact || n8nResult);

        // Extract ID
        const contactId = contact?.id || contact?.PageId;

        // Extraer Nombre (Lógica optimizada para evitar reasignaciones innecesarias)
        let name = contact?.name || contact?.Nombre || contact?.['Nombre completo'] || '';

        if (typeof name === 'object') {
            if (name?.title?.[0]?.plain_text) {
                name = name.title[0].plain_text;
            } else if (name?.rich_text?.[0]?.plain_text) {
                name = name.rich_text[0].plain_text;
            } else {
                name = ''; // Fallback si es un objeto pero no tiene el formato esperado
            }
        }

        // Extraer Email
        let email = contact?.email || contact?.Email || '';
        if (typeof email === 'object' && email?.email) {
            email = email.email;
        }

        if (contactId) {
            return NextResponse.json({
                exists: true,
                user: {
                    id: contactId,
                    name: name,
                    email: email,
                    phone: cleanPhone
                }
            });
        }

        return NextResponse.json({ exists: false });

    } catch (error: any) {
        console.error('Validation Error:', error);
        // Intentamos registrar el error en n8n
        try {
            await logEvent('Search Contact Error', cleanPhone || 'unknown', 'Error', error.message);
        } catch (logErr) {
            console.error('Failed to log event:', logErr);
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}