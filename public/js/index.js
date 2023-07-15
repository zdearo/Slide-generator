document.getElementById("urlForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const url = document.getElementById("url").value;
    let musica;

    fetch("/getLetra", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
    }).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                fetch("/criarApresentacao", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }).then((response) => {
                    response.blob().then((blob) => {
                        let link = document.createElement("a");
                        link.href = window.URL.createObjectURL(blob);
                        link.download = data.titulo + ".pptx";
                        link.click();
                    });
                });
            }
        });
    });
});
