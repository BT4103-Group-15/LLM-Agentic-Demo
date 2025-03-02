// Example of dynamically setting values
const projectData = {
    projectName: "01",
    clientId: "01",
    email: "client@example.com",
    status: "Drafting SOW",
    description: "This is a detailed description of the project."
};

// Setting dynamic content
document.getElementById("project-name").innerText = projectData.projectName;
document.getElementById("client-id").innerText = projectData.clientId;
document.getElementById("email").innerText = projectData.email;
document.getElementById("status").innerText = projectData.status;
document.getElementById("description").innerText = projectData.description;
