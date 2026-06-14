console.log("SCRIPT LOADED");

/* ==========================
   CUSTOM CURSOR
========================== */

const cursor = document.querySelector(".cursor");
const dot = document.querySelector(".cursor-dot");

if (cursor && dot) {

    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener("mousemove", (e) => {

        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";

        document.body.style.setProperty(
            "--mouse-x",
            mouseX + "px"
        );

        document.body.style.setProperty(
            "--mouse-y",
            mouseY + "px"
        );

    });

    function animateCursor() {

        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;

        cursor.style.left = cursorX + "px";
        cursor.style.top = cursorY + "px";

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document
        .querySelectorAll("button, select")
        .forEach(item => {

            item.addEventListener("mouseenter", () => {

                cursor.style.width = "45px";
                cursor.style.height = "45px";
                cursor.style.borderColor = "#22c55e";

            });

            item.addEventListener("mouseleave", () => {

                cursor.style.width = "20px";
                cursor.style.height = "20px";
                cursor.style.borderColor = "#38bdf8";

            });

        });

}


/* ==========================
   PREDICTION BUTTON
========================== */
console.log(
    document.getElementById("predictBtn")
);

const predictBtn = document.getElementById("predictBtn");

if (predictBtn) {

    predictBtn.addEventListener("click", async () => {

        predictBtn.innerHTML = "Analyzing...";
        predictBtn.disabled = true;

     const data = {

    Fever: Number(document.getElementById("Fever").value),
    Cough: Number(document.getElementById("Cough").value),
    Headache: Number(document.getElementById("Headache").value),
    Fatigue: Number(document.getElementById("Fatigue").value),
    Sore_Throat: Number(document.getElementById("Sore_Throat").value),
    Runny_Nose: Number(document.getElementById("Runny_Nose").value),
    Shortness_of_Breath: Number(document.getElementById("Shortness_of_Breath").value),
    Nausea: Number(document.getElementById("Nausea").value),
    Body_Ache: Number(document.getElementById("Body_Ache").value),
    Diarrhea: Number(document.getElementById("Diarrhea").value)

};

        try {
            

            const response = await fetch("/predict", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });

            if (!response.ok) {
                throw new Error(
                    "Server returned " + response.status
                );
            }
console.log("Sending Data:", data);
            const result = await response.json();
console.log("RESULT:", result);
console.log("DISEASES:", result.possible_conditions);
console.log("URGENCY:", result.urgency);
            console.log(result);

            const diseaseList =
                document.getElementById("diseaseList");

            diseaseList.innerHTML =
                result.possible_conditions.map(
                    disease =>
                        `<div class="disease-card">
                            🩺 ${disease}
                        </div>`
                ).join("");

            const riskLevel =
                document.getElementById("riskLevel");

            const riskMessage =
                document.getElementById("riskMessage");

            const modalCard =
                document.getElementById("modalCard");

            riskMessage.innerText =
                result.urgency;

            if (
                result.urgency.includes("HIGH")
            ) {

                riskLevel.innerText =
                    "🔴 HIGH RISK";

                riskLevel.style.color =
                    "#ef4444";

                modalCard.style.borderLeft =
                    "8px solid #ef4444";

            }

            else if (
                result.urgency.includes("MEDIUM")
            ) {

                riskLevel.innerText =
                    "🟠 MEDIUM RISK";

                riskLevel.style.color =
                    "#f59e0b";

                modalCard.style.borderLeft =
                    "8px solid #f59e0b";

            }

            else {

                riskLevel.innerText =
                    "🟢 LOW RISK";

                riskLevel.style.color =
                    "#22c55e";

                modalCard.style.borderLeft =
                    "8px solid #22c55e";

            }

            document.getElementById(
                "resultModal"
            ).style.display = "flex";

        }

        catch (error) {

            console.error(error);

            alert(
                "Prediction failed.\nCheck console and FastAPI logs."
            );

        }

        predictBtn.innerHTML =
            "Analyze Symptoms";

        predictBtn.disabled = false;

    });

}


/* ==========================
   MODAL CLOSE
========================== */

const closeBtn =
    document.querySelector(".close");

if (closeBtn) {

    closeBtn.addEventListener("click", () => {

        document.getElementById(
            "resultModal"
        ).style.display = "none";

    });

}

window.addEventListener("click", (e) => {

    const modal =
        document.getElementById("resultModal");

    if (e.target === modal) {

        modal.style.display = "none";

    }

});

document.querySelectorAll("select").forEach(select => {

    function updateColor(){

        if(select.value === "Yes"){

            select.style.borderColor = "#22c55e";

            select.style.boxShadow =
            "0 0 15px rgba(34,197,94,.35)";

        }

        else{

            select.style.borderColor =
            "rgba(56,189,248,.25)";

            select.style.boxShadow =
            "none";

        }

    }

    updateColor();

    select.addEventListener(
        "change",
        updateColor
    );

});