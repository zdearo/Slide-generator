async function fetchLetra(url) {
    try {
        const response = await fetch("/getLetra", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        throw new Error("Erro ao obter a letra da música: " + error.message);
    }
}

async function fetchApresentacao(data) {
    try {
        const response = await fetch("/criarApresentacao", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const blob = await response.blob();
        return blob;
    } catch (error) {
        throw new Error("Erro ao criar a apresentação: " + error.message);
    }
}

async function createApresentacao() {
    try {
        const url = document.getElementById("url").value;
        const data = await fetchLetra(url);

        const blob = await fetchApresentacao(data);

        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = data.titulo + ".pptx";
        link.click();
    } catch (error) {
        console.log(error.message);
    }
}

document.getElementById("urlForm").addEventListener("submit", (event) => {
    event.preventDefault();
    createApresentacao();
});
