import { NextResponse } from 'next/server';
import { searchContact, createContact, createPetition, logEvent } from '@/lib/n8n';

export async function POST(request: Request) {
    let userIdentifier = 'unknown';
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

        userIdentifier = phone || email || name || 'unknown';

        let contactId = body.contactId;

        // 1. Create or Find Contact if not provided
        if (!contactId && phone) {
            console.log('Searching for existing contact via n8n:', phone);
            const searchResult = await searchContact(phone);
            const existingContact = Array.isArray(searchResult) ? searchResult[0] : (searchResult.contact || searchResult);

            if (existingContact && (existingContact.id || existingContact.PageId)) {
                contactId = existingContact.id || existingContact.PageId;
                console.log('Found existing contact:', contactId);
            } else {
                console.log('Creating new contact via n8n');
                const newContactResult = await createContact({ name, phone, email });
                const newContact = Array.isArray(newContactResult) ? newContactResult[0] : (newContactResult.contact || newContactResult);
                contactId = newContact?.id || newContact?.PageId;

                if (!contactId) {
                    throw new Error('Failed to create or retrieve contact ID from n8n');
                }

                await logEvent('Create Contact', userIdentifier, 'Success', { contactId, name });
            }
        }

        // 2. Create Petition (Trip Request) via n8n
        console.log('Creating n8n petition for contact:', contactId);

        const petitionData = {
            contactId,
            name,
            email,
            phone,
            destination,
            tripType,
            dates,
            adults,
            children,
            childrenAges,
            notes,
            totalPeople: adults + children,
            submittedAt: new Date().toISOString()
        };

        const petitionResult = await createPetition(petitionData);

        await logEvent('Create Petition', userIdentifier, 'Success', petitionResult);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Submit Error:', error);
        await logEvent('Submit Flow Error', userIdentifier, 'Error', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
