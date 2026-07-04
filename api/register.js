const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

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

        // Send confirmation email via Resend
        if (RESEND_API_KEY) {
            try {
                const firstName = fullName.split(' ')[0];
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'TechConf 2026 <onboarding@resend.dev>',
                        to: email,
                        subject: 'Registration Confirmed - TechConf 2026',
                        html: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                                <div style="background: #2563EB; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                                    <h1 style="margin: 0; font-size: 28px;">Tech Conference 2026</h1>
                                    <p style="margin: 10px 0 0; opacity: 0.9;">Registration Confirmed</p>
                                </div>
                                <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0;">
                                    <h2 style="color: #1e293b; margin-top: 0;">Hi ${firstName},</h2>
                                    <p style="color: #475569; line-height: 1.6;">Your registration for <strong>Tech Conference 2026</strong> has been confirmed!</p>
                                    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
                                        <h3 style="color: #2563EB; margin-top: 0;">Event Details</h3>
                                        <p style="color: #475569; margin: 5px 0;">📅 <strong>Date:</strong> July 25, 2026</p>
                                        <p style="color: #475569; margin: 5px 0;">⏰ <strong>Time:</strong> 9:00 AM - 6:00 PM</p>
                                        <p style="color: #475569; margin: 5px 0;">📍 <strong>Location:</strong> To be announced</p>
                                        ${organization ? `<p style="color: #475569; margin: 5px 0;">🏫 <strong>Organization:</strong> ${organization}</p>` : ''}
                                        ${dietary && dietary !== 'none' ? `<p style="color: #475569; margin: 5px 0;">🍽️ <strong>Dietary:</strong> ${dietary}</p>` : ''}
                                    </div>
                                    <p style="color: #475569; line-height: 1.6;">We'll send you more details closer to the event. Get ready for an amazing day of talks, workshops, and networking!</p>
                                    <p style="color: #475569; line-height: 1.6;">See you there!</p>
                                    <p style="color: #1e293b; font-weight: bold;">TechConf 2026 Team</p>
                                </div>
                                <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
                                    <p>Tech Conference 2026 | July 25, 2026</p>
                                </div>
                            </div>
                        `
                    })
                });
                console.log('Confirmation email sent to:', email);
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
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
