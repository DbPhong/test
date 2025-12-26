document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded!'); // Debug
    
    const startBtn = document.getElementById('startBtn');
    const bgMusic = document.getElementById('bgMusic');
    const canvas = document.getElementById('snowCanvas');
    const ctx = canvas.getContext('2d');
    const frame2 = document.getElementById('frame2');
    const gallery = document.getElementById('gallery');
    const detail = document.getElementById('detail');
    const photoCard = document.getElementById('photoCard');
    const messageSection = document.getElementById('messageSection');
    const hint = document.querySelector('.hint');
    const photoSection = document.querySelector('.photo-section');
    const backBtn = document.getElementById('backBtn');
    const currentPhoto = document.getElementById('currentPhoto');
    
    if (!canvas || !ctx) {
        console.error('Canvas not found!');
        return;
    }
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Tuyết rơi
    let snowflakes = [];
    for (let i = 0; i < 150; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            drift: (Math.random() - 0.5) * 1.5,
            opacity: Math.random() * 0.6 + 0.4
        });
    }
    
    function drawSnow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snowflakes.forEach(flake => {
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 250, 240, ${flake.opacity})`; // Trắng ngọc trai
            ctx.fill();
            
            flake.y += flake.speed;
            flake.x += flake.drift;
            
            if (flake.y > canvas.height) {
                flake.y = -flake.size * 2;
                flake.x = Math.random() * canvas.width;
            }
            if (flake.x < 0 || flake.x > canvas.width) flake.drift *= -1;
        });
        requestAnimationFrame(drawSnow);
    }
    drawSnow();
    
    let isButtonClicked = false;
    let isMessageShown = false; // Theo dõi trạng thái message cho detail hiện tại
    let typingInProgress = false; // Theo dõi trạng thái typing message
    let currentSceneIndex = 0; // Index của scene hiện tại trong detail
    
    // Mảng các cảnh (ảnh + message). Bạn có thể thêm nhiều hơn bằng cách thêm object vào mảng này.
    // Thay thế src ảnh và messages cho phù hợp với file ảnh của bạn.
    const scenes = [
        {
            photo: '/Giang_Sinh/img/anh3.jpg',
            title: '💌 Lời anh viết cho em...',
            messages: [
                'Những khoảnh khắc này, với anh đều rất đặc biệt.',
                'Không phải vì chúng hoàn hảo,',
                'mà vì trong đó có em.',
                'Cảm ơn em vì đã ở bên anh,',
                'đã cùng anh đi qua những ngày rất bình thường.',
                'Anh thương em nhiều lắm ❤️'
            ]
        },
        {
            photo: '/Giang_Sinh/img/anh4.jpg', // Thay bằng đường dẫn ảnh thứ 2 của bạn
            title: '💕 Kỷ niệm Giáng sinh đầu tiên...',
            messages: [
                'Nhớ không em, đêm Noel ấy anh đã nắm tay em đi dạo.',
                'Tuyết rơi nhẹ, đèn lung linh,',
                'và tim anh rung động vì em.',
                'Em là món quà tuyệt vời nhất anh từng có.',
                'Hãy cùng anh tạo thêm nhiều kỷ niệm nhé.',
                'Yêu em mãi mãi ❄️'
            ]
        },
        {
            photo: '/Giang_Sinh/img/anh5.jpg', // Thay bằng đường dẫn ảnh thứ 3 của bạn
            title: '🎄 Ước mơ tương lai...',
            messages: [
                'Năm mới này, anh ước chúng ta mãi bên nhau.',
                'Dù có bao mùa Giáng sinh nữa,',
                'anh vẫn muốn ôm em dưới cây thông.',
                'Em là ánh sáng của anh.',
                'Cùng anh xây dựng những ngày hạnh phúc nhé.',
                'Anh yêu em ❤️'
            ]
        }
        // Thêm cảnh mới ở đây nếu muốn, ví dụ:
        // {
        //     photo: '/Giang_Sinh/img/photo4.jpg',
        //     title: 'Tiêu đề mới...',
        //     messages: ['Dòng 1', 'Dòng 2', ...]
        // }
    ];
    
    // Hàm tạo gallery thumbnails xếp lung tung toàn màn hình
    function createGallery() {
        gallery.innerHTML = '';
        scenes.forEach((scene, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail';
            thumb.dataset.scene = index;
            thumb.style.animationDelay = `${index * 0.2}s`; // Delay animation cho từng cái để rơi dần
            thumb.innerHTML = `
                <div class="thumb-inner">
                    <img src="${scene.photo}" class="thumb-photo" alt="Thumbnail ${index + 1}">
                </div>
                <img src="/Giang_Sinh/img/khung2.png" class="thumb-overlay">
            `;
            gallery.appendChild(thumb);
        });
        
        // Random position và rotation cho mỗi thumbnail trên toàn màn hình
        document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const thumbWidth = 150;
            const thumbHeight = 120;
            
            // Random position trên toàn màn hình, tránh quá sát biên (margin 50px)
            const x = Math.random() * (screenWidth - thumbWidth - 100) + 50;
            const y = Math.random() * (screenHeight - thumbHeight - 100) + 50;
            const rotate = (Math.random() - 0.5) * 20; // Rotate từ -10 đến 10 độ
            const scale = 0.8 + Math.random() * 0.4; // Scale từ 0.8 đến 1.2
            
            thumb.style.left = `${x}px`;
            thumb.style.top = `${y}px`;
            thumb.style.transform = `rotate(${rotate}deg) scale(${scale})`;
            
            // Add click listeners
            thumb.addEventListener('click', (e) => {
                const sceneIndex = parseInt(e.currentTarget.dataset.scene);
                showDetail(sceneIndex);
            });

            // Fallback cho thumbnail nếu ảnh lỗi (tùy chọn)
            const thumbImg = thumb.querySelector('.thumb-photo');
            thumbImg.onerror = function() {
                this.src = '/Giang_Sinh/img/placeholder.jpg'; // Thay bằng ảnh placeholder nếu bạn có
            };
        });
    }
    
    // Hàm load scene vào detail
    function loadScene(index) {
        const scene = scenes[index];
        currentPhoto.src = scene.photo;
        document.getElementById('messageTitle').textContent = scene.title;
        
        // Clear messages
        const msgLines = ['msgLine1', 'msgLine2', 'msgLine3', 'msgLine4', 'msgLine5', 'msgLine6'];
        msgLines.forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) el.textContent = i < scene.messages.length ? '' : '';
        });
        
        currentSceneIndex = index;
        // Reset message shown cho scene mới
        isMessageShown = false;

        // Fallback cho currentPhoto nếu ảnh lỗi (tùy chọn)
        currentPhoto.onerror = function() {
            this.src = '/Giang_Sinh/img/placeholder.jpg'; // Thay bằng ảnh placeholder nếu bạn có
        };
    }
    
    // Hàm show detail cho scene
    function showDetail(index) {
        loadScene(index);
        gallery.style.display = 'none';
        detail.classList.remove('hidden');
        detail.style.display = 'flex';
        
        // Reset hint và message
        hint.style.display = 'block';
        hint.style.opacity = '0.9';
        messageSection.classList.add('hidden');
        photoSection.classList.remove('scaled');
    }
    
    // Hàm hide detail và show gallery
    function hideDetail() {
        // Reset trạng thái message
        isMessageShown = false;
        typingInProgress = false;
        photoSection.classList.remove('scaled');
        messageSection.classList.remove('show');
        messageSection.classList.add('hidden');
        hint.style.display = 'block';
        hint.style.opacity = '0.9';
        
        gallery.style.display = 'block';
        detail.classList.add('hidden');
        detail.style.display = 'none';
    }
    
    // Click button start
    startBtn.addEventListener('click', () => {
        if (isButtonClicked) return;
        isButtonClicked = true;
        
        bgMusic.volume = 0.3;
        bgMusic.play().catch(error => console.error('Lỗi nhạc:', error));
        
        startBtn.textContent = "Anh đang nói nè… 💕";
        startBtn.style.animationPlayState = 'running';
        
        const title = document.getElementById('titleText');
        title.style.opacity = '1';
        
        typeText(title, "Giáng sinh này, anh có điều muốn nói…", 120);
        
        // Tạo gallery và show frame2 sau ~6s
        setTimeout(() => {
            createGallery();
            frame2.style.display = 'flex';
            setTimeout(() => frame2.classList.add('show'), 100);
        }, 6000);
    });
    
    // Click back button
    backBtn.addEventListener('click', hideDetail);
    
    // Click photo trong detail để show message
    photoCard.addEventListener('click', () => {
        if (isMessageShown) return; // Chỉ show một lần cho scene hiện tại
        isMessageShown = true;
        
        // Ẩn hint với fade out
        hint.style.opacity = '0';
        setTimeout(() => {
            hint.style.display = 'none';
        }, 300);
        
        // Scale nhỏ lại photo-section (khung ảnh)
        photoSection.classList.add('scaled');
        
        // Show message với animation slide up
        messageSection.classList.remove('hidden');
        setTimeout(() => {
            messageSection.classList.add('show');
        }, 100);
        
        // Define fast-forward listener
        const fastForwardListener = (e) => {
            if (typingInProgress && e.target.id !== 'backBtn') { // Tránh trigger khi click back
                typingInProgress = false;
                // Fill all texts immediately
                fillMessagesImmediately(scenes[currentSceneIndex]);
                // Remove listener
                detail.removeEventListener('click', fastForwardListener);
            }
        };
        
        // Add listener before starting typing (chỉ trên detail)
        detail.addEventListener('click', fastForwardListener);
        
        // Start typing sau khi animation hoàn thành
        setTimeout(() => {
            typeMessage(fastForwardListener);
        }, 900);
    });
    
    // Hàm fill messages ngay lập tức
    function fillMessagesImmediately(scene) {
        document.getElementById('messageTitle').innerHTML = scene.title;
        const msgLines = ['msgLine1', 'msgLine2', 'msgLine3', 'msgLine4', 'msgLine5', 'msgLine6'];
        msgLines.forEach((id, i) => {
            const el = document.getElementById(id);
            if (el && i < scene.messages.length) {
                el.innerHTML = scene.messages[i];
                if (i === scene.messages.length - 1) el.classList.add('highlight');
            }
        });
    }
    
    // TypeText với callback
    function typeText(element, text, speed = 120, callback = null) {
        element.innerHTML = '';
        let i = 0;
        
        function typeStep() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                
                let delay = speed;
                if (text.charAt(i - 1) === '…' || text.charAt(i - 1) === ',') delay = 600;
                
                setTimeout(typeStep, delay);
            } else {
                if (callback) callback();
            }
        }
        typeStep();
    }
    
    // Type message sequentially
    function typeMessage(fastForwardListener) {
        typingInProgress = true;
        const scene = scenes[currentSceneIndex];
        const h3 = document.getElementById('messageTitle');
        const msgLines = ['msgLine1', 'msgLine2', 'msgLine3', 'msgLine4', 'msgLine5', 'msgLine6'];
        
        const texts = [
            {el: h3, text: scene.title},
            ...scene.messages.map((msg, i) => ({el: document.getElementById(msgLines[i]), text: msg}))
        ].filter(item => item.el); // Lọc nếu ít dòng hơn 6
        
        let index = 0;
        
        function typeNext() {
            if (index < texts.length && typingInProgress) {
                const item = texts[index];
                typeText(item.el, item.text, 150, () => {
                    setTimeout(() => {
                        index++;
                        typeNext();
                    }, 800); // Pause sau mỗi dòng
                });
            } else {
                typingInProgress = false;
                // Remove listener when done
                detail.removeEventListener('click', fastForwardListener);
            }
        }
        typeNext();
    }
    
    console.log('Setup complete!');
});