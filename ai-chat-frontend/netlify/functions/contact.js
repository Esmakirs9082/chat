// Contact form handler с уведомлениями
exports.handler = async (event, context) => {
  // Только POST запросы
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Allow': 'POST',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Method not allowed. Use POST.' 
      })
    };
  }

  try {
    const { name, email, subject, message, type } = JSON.parse(event.body);
    
    // Валидация
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Missing required fields: name, email, message' 
        })
      };
    }

    // Email валидация
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Invalid email format' 
        })
      };
    }

    // Spam protection - простая проверка
    if (message.length < 10 || message.length > 5000) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: 'Message must be between 10 and 5000 characters' 
        })
      };
    }

    const timestamp = new Date().toISOString();
    const contactData = {
      id: generateId(),
      timestamp,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || 'Contact Form Submission',
      message: message.trim(),
      type: type || 'general',
      userAgent: event.headers['user-agent'],
      ip: event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'],
      source: 'contact-form'
    };

    // TODO: Сохранение в базу данных
    // await saveToDatabase(contactData);

    // TODO: Отправка уведомления
    // await sendNotification(contactData);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('Contact form submission:', {
      id: contactData.id,
      email: contactData.email,
      timestamp
    });

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        success: true,
        message: 'Thank you for your message! We\'ll get back to you soon.',
        id: contactData.id,
        timestamp
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal server error. Please try again later.',
        timestamp: new Date().toISOString()
      })
    };
  }
};

// Генерация простого ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}