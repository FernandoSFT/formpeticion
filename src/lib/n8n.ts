const N8N_WEBHOOK_SEARCH_CONTACT = "https://n8n-n8n.vm5ncf.easypanel.host/webhook/49163e85-74ef-4983-8ed6-37e275e3ee6f";
const N8N_WEBHOOK_CREATE_CONTACT = "https://n8n-n8n.vm5ncf.easypanel.host/webhook/413b8136-9dca-461e-875e-782153c75ea2";
const N8N_WEBHOOK_CREATE_PETITION = "https://n8n-n8n.vm5ncf.easypanel.host/webhook/03e31b6a-3b96-4a22-b035-8b71aa361c04";
const N8N_WEBHOOK_LOG = "https://n8n-n8n.vm5ncf.easypanel.host/webhook/390f2a4a-c6c7-4db2-a384-ed17d0789406";

export async function logEvent(event: string, user: string, status: 'Success' | 'Error', details: any) {
    try {
        console.log(`[n8n-log] Event: ${event}, User: ${user}, Status: ${status}`);
        const response = await fetch(N8N_WEBHOOK_LOG, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event,
                user,
                status,
                details: typeof details === 'string' ? details : JSON.stringify(details),
                timestamp: new Date().toISOString()
            })
        });
        if (!response.ok) {
            console.error('[n8n-log] Webhook returned error:', await response.text());
        }
    } catch (error) {
        console.error('[n8n-log] Failed to send log to n8n:', error);
    }
}

export async function searchContact(phone: string) {
    console.log('[n8n-search] Fetching (POST):', N8N_WEBHOOK_SEARCH_CONTACT, 'with phone:', phone);

    const response = await fetch(N8N_WEBHOOK_SEARCH_CONTACT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
    });

    const text = await response.text();
    console.log('[n8n-search] Response:', text);

    if (!response.ok) {
        throw new Error(`n8n search error (${response.status}): ${text}`);
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        console.warn('[n8n-search] Response is not JSON, returning text');
        return { text };
    }
}

export async function createContact(data: { name: string, phone: string, email: string }) {
    console.log('[n8n-create-contact] Sending data:', data);
    const response = await fetch(N8N_WEBHOOK_CREATE_CONTACT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const text = await response.text();
    console.log('[n8n-create-contact] Response:', text);

    if (!response.ok) {
        throw new Error(`n8n create contact error (${response.status}): ${text}`);
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return { text };
    }
}

export async function createPetition(data: any) {
    console.log('[n8n-create-petition] Sending data:', data);
    const response = await fetch(N8N_WEBHOOK_CREATE_PETITION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const text = await response.text();
    console.log('[n8n-create-petition] Response:', text);

    if (!response.ok) {
        throw new Error(`n8n create petition error (${response.status}): ${text}`);
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return { text };
    }
}
