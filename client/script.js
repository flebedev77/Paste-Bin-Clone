const pasteArea = document.getElementById("paste-area");
const submitButton = document.getElementById("submit");

submitButton.onclick = function() {
    fetch("/submit-paste", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ paste: pasteArea.value })
    }).then(res => {
        if (res.ok) return res.json();
    }).then(data => {
        console.log(data);

        if (data.ok) {
            window.location.href = data.url;
        }
    })
}