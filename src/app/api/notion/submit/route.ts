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
            childrenAges,
            notes
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
      
      Notas del cliente:
      ${notes || 'Ninguna'}
    `;

        console.log('Creating Notion petition for contact:', contactId);

        try {
            const petitionProperties: any = {
                'Viaje': {
                    title: [{ text: { content: tripTitle } }]
                },
                'Viajero Principal': {
                    relation: [{ id: contactId }]
                },
                'Observaciones': {
                    rich_text: [{ text: { content: descriptionBlock } }]
                }
            };

            // Only add these if they might exist in the DB schema
            // We use strings for 'Total personas' as per your original code, 
            // but if it's a number it will fail.
            if (adults !== undefined) {
                petitionProperties['Total personas'] = {
                    rich_text: [{ text: { content: `${adults + children}` } }]
                };
            }

            if (destination) {
                // We try multi_select but if it fails we might want to know
                petitionProperties['Destino'] = {
                    multi_select: [{ name: destination.replace(',', '') }] // Ensure no commas in names
                };
            }

            await notion.pages.create({
                parent: { database_id: PETITIONS_DB_ID },
                properties: petitionProperties
            });
        } catch (notionError: any) {
            console.error('Notion Creation Error Details:', JSON.stringify(notionError.body || notionError));
            throw new Error(`Error en Notion: ${notionError.message}`);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Submit Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
