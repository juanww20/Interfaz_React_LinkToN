import React, { useState } from 'react';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar el formulario
        console.log('Datos del formulario:', formData);
        // Simulación de envío exitoso
        alert('Your message has been sent. Thank you!');
    };

    return (
        <section id="contact">
            <div className="container-fluid">
                <div className="section-header">
                    <h3>Contact Us</h3>
                </div>

                <div className="contact-info row">
                    <div className="col-lg-6">
                        <div className="row">
                            <div className="col-md-5 info">
                                <i className="ion-ios-location-outline"></i>
                                <p>A108 Adam Street, NY 535022</p>
                            </div>
                            <div className="col-md-4 info">
                                <i className="ion-ios-email-outline"></i>
                                <p>info@example.com</p>
                            </div>
                            <div className="col-md-3 info">
                                <i className="ion-ios-telephone-outline"></i>
                                <p>+1 5589 55488 55</p>
                            </div>
                        </div>

                        <div className="form">
                            <div id="sendmessage">Your message has been sent. Thank you!</div>
                            <div id="errormessage"></div>
                            <form onSubmit={handleSubmit} className="contactForm">
                                <div className="form-row">
                                    <div className="form-group col-lg-6">
                                        <label htmlFor="name">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            minLength="4"
                                            required
                                        />
                                        <div className="validation"></div>
                                    </div>
                                    <div className="form-group col-lg-6">
                                        <label htmlFor="email">Your Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="validation"></div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="subject"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        minLength="4"
                                        required
                                    />
                                    <div className="validation"></div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        className="form-control"
                                        name="message"
                                        id="message"
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                    <div className="validation"></div>
                                </div>
                                <div className="text-center">
                                    <button type="submit" title="Send Message" style={{ fontSize: 'var(--text-font)' }}>
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;