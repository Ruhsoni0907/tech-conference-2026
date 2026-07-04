export default async function handler(req, res) {
    // CORS headers
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

    // Validate required fields
    if (!fullName || !email) {
        return res.status(400).json({ error: 'Full name and email are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    try {
        // Log registration (in production, save to database or send email)
        console.log('New Registration:', {
            fullName,
            email,
            phone,
            organization,
            jobTitle,
            dietary,
            submittedAt: submittedAt || new Date().toISOString()
        });

        // Here you can integrate with:
        // - SendGrid/Mailgun for emails
        // - Supabase/PlanetScale for database
        // - Slack/Discord for notifications

        return res.status(200).json({
            success: true,
            message: 'Registration successful! You will receive a confirmation email shortly.',
            data: {
                id: Date.now().toString(36),
                fullName,
                email,
                submittedAt: submittedAt || new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal server error. Please try again.' });
    }
}
