// Fetch units
fetch("https://mdshahilak.pythonanywhere.com/api/main/units/")
  .then(response => response.json())
  .then(units => {
    const unitSelect = document.getElementById("unit");
    units.forEach(unit => {
      const option = document.createElement("option");
      option.value = unit.name;
      option.textContent = unit.name;
      unitSelect.appendChild(option);
    });
  });

// Fetch designations
fetch("https://mdshahilak.pythonanywhere.com/api/main/designations/")
  .then(response => response.json())
  .then(designations => {
    const designationSelect = document.getElementById("designation");
    designations.forEach(designation => {
      const option = document.createElement("option");
      option.value = designation.name;
      option.textContent = designation.name;
      designationSelect.appendChild(option);
    });
  });

function registerEvent() {
  const name = document.getElementById('name').value;
  const designation = document.getElementById('designation').value;
  const unit = document.getElementById('unit').value;
  const phone = document.getElementById('phone').value;
  const photoInput = document.getElementById('photo');
  const file = photoInput.files[0];

  if (!name || !designation || !unit || !phone) {
    alert("All fields except photo are required!");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("designation", designation);
  formData.append("unit", unit);
  formData.append("phone", phone);
  if (file) {
    formData.append("photo", file, file.name);
  }

  fetch("https://mdshahilak.pythonanywhere.com/api/main/students/", {
    method: "POST",
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => { throw new Error(JSON.stringify(err)); });
    }
    return response.json();
  })
  .then(data => {
    document.getElementById('cardName').textContent = data.name;
    document.getElementById('cardPhone').textContent = "Mobile: " + data.phone;
    document.getElementById('cardUnit').textContent = data.unit;

    fetch(data.photo)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = function () {
          document.getElementById('cardPhoto').src = reader.result;
        };
        reader.readAsDataURL(blob);
      });

    document.getElementById('delegateCard').style.display = 'block';
    document.getElementById('downloadBtn').style.display = 'inline-block';
    window.scrollTo({ top: document.getElementById('delegateCard').offsetTop, behavior: 'smooth' });
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Error: " + error.message);
  });
}

function downloadDelegateCard() {
  html2canvas(document.querySelector(".delegate-card"), {
    useCORS: true,
    allowTaint: true,
    backgroundColor: null
  }).then(canvas => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "Delegate_Card.png";
    link.click();
  });
}
