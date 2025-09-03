document.addEventListener("DOMContentLoaded", () => {
    // ---------- NÚT ẨN/HIỆN ----------
    const collapsibleButtons = document.querySelectorAll('.collapsible-button');

    collapsibleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetContent = document.getElementById(targetId);

            button.classList.toggle('active');
            targetContent.classList.toggle('active');
        });
    });

    // ---------- QR CODE ----------
    const qrImage = document.getElementById("qrImage");
    const createBtn = document.getElementById("myButton");
    const deleteBtn = document.getElementById("deleteButton");
    const countdownElement = document.getElementById("countdown");
    const wordCountElement = document.getElementById("wordCount");

    const donorNameInput = document.getElementById("donorName");
    const donationContentInput = document.getElementById("donationContent");
    const amountInput = document.getElementById("amount");

    let timeoutId;
    let countdownIntervalId;

    function startAutoDeleteTimer() {
        clearTimeout(timeoutId);
        clearInterval(countdownIntervalId);

        let timeLeft = 600; // 10 phút
        countdownElement.style.display = "block";
        countdownElement.style.color = "#000";

        const updateCountdown = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            countdownElement.textContent = `Mã QR sẽ tự xóa trong: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            if (timeLeft <= 0) {
                clearInterval(countdownIntervalId);
                countdownElement.style.display = "none";
            }
            timeLeft--;
        };

        updateCountdown();
        countdownIntervalId = setInterval(updateCountdown, 1000);

        timeoutId = setTimeout(() => {
            qrImage.src = "";
            qrImage.style.display = "none";
            countdownElement.textContent = "Mã QR đã tự động được xóa.";
            countdownElement.style.color = "#ef4444";
            deleteBtn.style.display = "none";
        }, 600000);
    }

    // ---------- XỬ LÝ INPUT ----------
    // Chỉ cho nhập số
    amountInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '');
    });

    // Giới hạn tên donor 10 ký tự
    donorNameInput.addEventListener('input', (e) => {
        let text = e.target.value;
        const limit = 10;

        if (text.length > limit) {
            e.target.value = text.substring(0, limit);
        }
    });

    // Giới hạn nội dung donate 200 ký tự + auto resize + bộ đếm
    donationContentInput.addEventListener('input', (e) => {
        let text = e.target.value;
        const limit = 200;

        // Cắt chuỗi nếu vượt quá giới hạn
        if (text.length > limit) {
            text = text.substring(0, limit);
            e.target.value = text;
        }

        // Cập nhật bộ đếm ký tự
        wordCountElement.textContent = `${text.length}/200 ký tự`;

        // Auto resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    });
    
    // ---------- TẠO QR CODE ----------
    createBtn.addEventListener("click", () => {
        const bin = "970422";
        const accountNumber = "1234567890123";
        const accountName = "TRAN DUC TAI";

        const donorName = donorNameInput.value || "Bạn ẩn danh";
        const donationContent = donationContentInput.value || "Donate cho Min";
        const amount = parseInt(amountInput.value) || 0;

        const addInfo = `${donorName} - ${donationContent}`;
        const encodedName = encodeURIComponent(accountName);
        const encodedInfo = encodeURIComponent(addInfo);

        const url = `https://img.vietqr.io/image/${bin}-${accountNumber}-print.png?accountName=${encodedName}&amount=${amount}&addInfo=${encodedInfo}`;

        qrImage.src = url;
        qrImage.style.display = "block";
        deleteBtn.style.display = "block";

        startAutoDeleteTimer();
    });

    // ---------- XÓA QR CODE ----------
    deleteBtn.addEventListener("click", () => {
        qrImage.src = "";
        qrImage.style.display = "none";
        clearTimeout(timeoutId);
        clearInterval(countdownIntervalId);
        countdownElement.style.display = "none";
        deleteBtn.style.display = "none";
    });
});
