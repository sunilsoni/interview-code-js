document.addEventListener("DOMContentLoaded", () => {
    const accordions = document.querySelectorAll(".accordion");
    const multiSelectCheckbox = document.getElementById("multiselect");

    accordions.forEach((accordion) => {
        const titleSection = accordion.querySelector(".title-section");
        const description = accordion.querySelector(".description");
        const expandIcon = accordion.querySelector(".expand-icon");
        const collapseIcon = accordion.querySelector(".collapse-icon");

        if (!expandIcon || !collapseIcon) {
            console.error("Expand/Collapse icons missing in:", accordion);
            return;
        }

        // Ensure first item is expanded
        if (accordion.dataset.testid === "1") {
            description.style.display = "block";
            expandIcon.style.display = "none";
            collapseIcon.style.display = "inline-block";
        } else {
            description.style.display = "none";
            expandIcon.style.display = "inline-block";
            collapseIcon.style.display = "none";
        }

        titleSection.addEventListener("click", () => {
            const isExpanded = description.style.display === "block";

            if (!multiSelectCheckbox.checked) {
                accordions.forEach((acc) => {
                    const desc = acc.querySelector(".description");
                    const expIcon = acc.querySelector(".expand-icon");
                    const collIcon = acc.querySelector(".collapse-icon");

                    if (desc) desc.style.display = "none";
                    if (expIcon) expIcon.style.display = "inline-block";
                    if (collIcon) collIcon.style.display = "none";
                });
            }

            // Toggle current item
            description.style.display = isExpanded ? "none" : "block";
            expandIcon.style.display = isExpanded ? "inline-block" : "none";
            collapseIcon.style.display = isExpanded ? "none" : "inline-block";
        });
    });
});
