import React from "react";
import "./NewsletterSubscription.css";

export const NewsletterSubscription: React.FC = () => {
  return (
    <section className="newsletter">
      <p className="stay-up-to-date">Stay up to date</p>
      <h2 className="newsletter-title">Join Our Newsletter</h2>
      <div className="subscribe-section">
        <input
          type="email"
          placeholder="Enter your email.."
          className="email-input"
        />
        <button className="submit-button">Submit</button>
      </div>
      <p className="unsubscribe-text">*You can unsubscribe anytime</p>
    </section>
  );
};
