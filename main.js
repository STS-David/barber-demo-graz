document.addEventListener('DOMContentLoaded', async () => {

    lucide.createIcons();


    try {
        const response = await fetch('reviews.json');
        const reviews = await response.json();
        const container = document.getElementById('reviews-container');

        reviews.forEach(review => {
            const card = document.createElement('div');
            card.className = 'p-10 bg-white/5 border border-white/5 flex flex-col justify-between hover:border-gold/30 transition-all duration-500 group';
            
            const stars = Array(review.rating).fill('<i data-lucide="star" class="fill-gold w-3 h-3 text-gold"></i>').join('');
            

            let dateStr = review.date;
            if(dateStr.includes('months ago')) dateStr = dateStr.replace('months ago', 'Monaten');
            if(dateStr.includes('a year ago')) dateStr = 'vor einem Jahr';

            card.innerHTML = `
                <div>
                    <div class="flex space-x-1 mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                        ${stars}
                    </div>
                    <p class="text-gray-300 font-playfair italic text-lg mb-8 leading-relaxed line-clamp-4 group-hover:text-white transition-colors">"${review.text}"</p>
                </div>
                <div class="border-t border-white/5 pt-6 flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xs">
                        ${review.name.charAt(0)}
                    </div>
                    <div>
                        <p class="text-white font-bold text-[10px] uppercase tracking-widest">${review.name}</p>
                        <p class="text-gray-500 text-[9px] mt-1 uppercase tracking-tighter">${dateStr}</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        
        lucide.createIcons();
    } catch (error) {
        console.error('Error loading reviews:', error);
    }


    gsap.registerPlugin(ScrollTrigger);


    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section.querySelectorAll('h2, h1, p, .group'), {
            opacity: 0,
            y: 30,
            duration: 1.2,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });


    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('h-16', 'shadow-2xl', 'bg-[#0a0a0a]');
            nav.classList.remove('h-20');
        } else {
            nav.classList.remove('h-16', 'shadow-2xl', 'bg-[#0a0a0a]');
            nav.classList.add('h-20');
        }
    });


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
