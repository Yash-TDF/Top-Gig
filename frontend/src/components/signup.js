const signupUser = (formData) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "http://localhost:8000/auth/signup";

  Object.entries(formData).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

export default signupUser;
