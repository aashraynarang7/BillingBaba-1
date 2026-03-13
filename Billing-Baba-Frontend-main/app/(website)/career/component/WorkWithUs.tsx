import Image from 'next/image';

const WorkWithUs = () => {
  return (
    <section className="relative w-full bg-white pt-20 pb-48 px-6 sm:px-10 lg:px-20 overflow-hidden font-sans">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row justify-between items-center gap-12 z-10 relative">
        
        <div className="lg:w-5/12 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[color:var(--primary-red)] mb-6">
            Work With Us
          </h2>
          <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8">
            Join our teams and have the freedom to do your best work. We are building a culture with amazing people like you at its centre. Your work here will help millions of small businesses succeed & grow
          </p>
          <button className="bg-[var(--primary-red)] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300">
            Check Open Positions
          </button>
        </div>

        <div className="w-full lg:w-6/12 h-[450px] sm:h-[500px] relative mt-12 lg:mt-0">
          <div className="absolute w-[260px] h-[140px] md:w-[250px] md:h-[180px] top-0 left-[10px] rounded-2xl overflow-hidden z-10">
            <Image src="/Career/office2.webp" alt="Company office exterior" layout="fill" objectFit="cover" />
          </div>
          
          <div className="absolute w-[160px] h-[260px] md:w-[250px] md:h-[380px] top-0 right-0 sm:right-[50px] rounded-2xl overflow-hidden z-30">
            <video 
              src="/Career/my-office-work-short-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute w-[200px] h-[100px] md:w-[250px] md:h-[180px] top-[150px] md:top-[190px] left-0 sm:left-[60px] rounded-2xl overflow-hidden  z-10">
            <Image src="/Career/office1.webp" alt="Team relaxing in a lounge" layout="fill" objectFit="cover" />
          </div>

          <div className="absolute w-[250px] h-[140px] bottom-[40px] md:bottom-[-30px] left-1/4 sm:left-[120px] rounded-2xl overflow-hidden  z-20">
            <Image src="/Career/office3.jpg" alt="Team playing foosball" layout="fill" objectFit="cover" />
          </div>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-auto z-0">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path 
            fill="#FFC300" 
            fillOpacity="1" 
            d="M0,224L60,197.3C120,171,240,117,360,117.3C480,117,600,171,720,197.3C840,224,960,224,1080,208C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
          <path 
            fill="#E63946" 
            fillOpacity="1" 
            d="M0,256L60,245.3C120,235,240,213,360,202.7C480,192,600,192,720,208C840,224,960,256,1080,261.3C1200,267,1320,245,1380,234.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default WorkWithUs;