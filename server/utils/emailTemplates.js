export const forgotPasswordTemplate = (name, url) => {
  return `
    <h2>Hello ${name}</h2>
    <p>Click below to reset password:</p>
    <a href="${url}">${url}</a>
  `;
};
