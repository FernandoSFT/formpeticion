import { NextResponse } from 'next/server';
import { queryDatabase, CONTACTS_DB_ID } from '@/lib/notion';

export async function POST(request: Request) {
    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
        }

        // Normalize phone: remove spaces, dots, dashes
        const cleanPhone = phone.replace(/[\s\.\-]/g, '');

        console.log('Validating phone:', cleanPhone);

        // Try exact match first
        const results = await queryDatabase(CONTACTS_DB_ID, {
            property: 'Teléfono',
            phone_number: {
                equals: cleanPhone
            }
        });

        // If no results, try with leading + if not present, or without it
        // Notion phone_number filter is very restrictive.
        // Some users store it as "600000000" and others as "+34600000000"

        if (results.results.length > 0) {
            const page = results.results[0];
            const props = page.properties;

            const name = props['Nombre completo']?.title?.[0]?.plain_text || '';
            const email = props['Email']?.email || '';

            return NextResponse.json({
                exists: true,
                user: {
                    id: page.id,
                    name,
                    email,
                    phone
                }
            });
        }

        return NextResponse.json({ exists: false });

    } catch (error: any) {
        console.error('Validation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
