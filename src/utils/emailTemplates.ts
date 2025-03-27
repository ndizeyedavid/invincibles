export interface ResetPasswordEmail {
  resetLink: string;
}

const baseEmailStyle = `
  font-family: Arial, sans-serif;
  padding: 40px;
  margin: 40px auto 20px;
  width: 80%;
  max-width: 600px;
  background: linear-gradient(to bottom right, #e0f7fa, #b2ebf2);
  border: 5px solidrgb(101, 186, 219);
  border-radius: 20px;
  text-align: center;
`;

export const forgetPasswordEmailTemplate = (
  data: ResetPasswordEmail
): string => {
  return `
    <div style="${baseEmailStyle}">
    <h2 style="color: #0c984d;">Reset Your Password</h2>
    <p style="font-size: 16px; color: #333;">
      We received a request to reset your password. Click the button below to create a new one:
    </p>
    <a href="${data.resetLink}" 
       style="display: inline-block; background: #0c984d; color: #fff; padding: 12px 24px; 
       border-radius: 8px; text-decoration: none; font-size: 16px; margin-top: 15px;">
       Reset Password
    </a>
    <p style="font-size: 14px; color: #666; margin-top: 20px;">
      If you didn't request this, please ignore this email. The link will expire in 24 hours.
    </p>
    <p style="font-size: 14px; color: #666;">
      Need help? <a href="mailto:support@yourrentalplatform.com" style="color: #0c984d;">Contact Support</a>
    </p>
  </div>
  `;
};
