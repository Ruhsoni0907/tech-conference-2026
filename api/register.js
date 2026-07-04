const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { fullName, email, phone, organization, jobTitle, dietary, submittedAt } = req.body;

    if (!fullName || !email) {
        return res.status(400).json({ error: 'Full name and email are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/registrations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                full_name: fullName,
                email: email,
                phone: phone || null,
                organization: organization || null,
                job_title: jobTitle || null,
                dietary: dietary || null,
                submitted_at: submittedAt || new Date().toISOString()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Supabase error:', data);
            return res.status(500).json({ error: 'Failed to save registration' });
        }

        return res.status(200).json({
            success: true,
            message: 'Registration successful! You will receive a confirmation email shortly.',
            data: data[0]
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal server error. Please try again.' });
    }
}
