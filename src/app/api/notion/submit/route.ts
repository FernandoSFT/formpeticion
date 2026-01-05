import { NextResponse } from 'next/server';
import { notion, CONTACTS_DB_ID, PETITIONS_DB_ID, queryDatabase } from '@/lib/notion';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            phone,
            name,
            email,
            destination,
            tripType,
            dates,
            adults,
            children,
            childrenAges
        } = body;

        let contactId = body.contactId;

        // 1. Create or Find Contact
        if (!contactId) {
            // Create Contact
            // Note: We normally check existence again, but we assume flow handled it.
            // Or we can rely on existing checks.

            // Check existence one last time to avoid duplicates if UI skipped it
            const existing = await queryDatabase(CONTACTS_DB_ID, {
                property: 'Teléfono',
                phone_number: { equals: phone }
            });

            if (existing.results.length > 0) {
                contactId = existing.results[0].id;
                // Optionally update email/name if provided and different?
            } else {
                const newContact = await notion.pages.create({
                    parent: { database_id: CONTACTS_DB_ID },
                    properties: {
                        'Nombre completo': {
                            title: [{ text: { content: name } }]
                        },
                        'Teléfono': {
                            phone_number: phone
                        },
                        'Email': {
                            email: email
                        }
                    }
                });
                contactId = newContact.id;
            }
        }

        // 2. Create Petition (Trip Request)
        const tripTitle = name ? `Solicitud Web - ${name}` : 'Solicitud Web';
        const descriptionBlock = `
      Tipo: ${tripType}
      Adultos: ${adults}
      Niños: ${children}
      Edades niños: ${childrenAges || 'N/A'}
      Fechas: ${JSON.stringify(dates)}
    `;

        await notion.pages.create({
            parent: { database_id: PETITIONS_DB_ID },
            properties: {
                'Viaje': {
                    title: [{ text: { content: tripTitle } }]
                },
                'Viajero Principal': {
                    relation: [{ id: contactId }]
                },
                'Destino': {
                    multi_select: destination ? [{ name: destination }] : []
                },
                // We put details in Observaciones because fields might not match exactly
                'Observaciones': {
                    rich_text: [{ text: { content: descriptionBlock } }]
                },
                'Total personas': {
                    rich_text: [{ text: { content: `${adults + children}` } }]
                }
                // F. Inicio Viaje and F. Fin de Viaje
                // We need to parse dates. 'dates' object structure depends on frontend picker.
                // Assuming dates = { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
            }
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Submit Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
