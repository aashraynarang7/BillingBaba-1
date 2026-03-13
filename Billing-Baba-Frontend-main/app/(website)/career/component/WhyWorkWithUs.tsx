import Image from 'next/image';

const WhyWorkWithUs = () => {
  return (
    <section className="py-20 sm:py-28 px-10 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-text-primary mb-16 sm:mb-24">
          Why Work With Us
        </h2>

        <div className="space-y-20">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h3 className="font-semibold italic text-lg text-[color:var(--primary-red)] mb-3">
                We Value People
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed">
                People are at the centre of our culture. We are not in a mad race for unsustainable growth. The org structure is flat where leadership team to interns, everyone freely shares information, knowledge and ideas. You will have ownership and will be empowered to learn fast & grow faster in your roles. Transparency, Trust, Leadership are the pillars of our cultural values.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="relative w-full aspect-w-4 aspect-h-3  overflow-hidden ">
                <Image 
                  height={400}
                  width={400}
                  src="/Career/why-work-with-us-1.png" 
                  alt="A vibrant team working at the office" 
                  objectFit="cover" 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-12 lg:gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h3 className="font-semibold italic text-lg text-[color:var(--primary-red)] mb-3">
                We Challenge Challenges
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed">
                Your challenge would be to create the most simple solutions for the most complex problems. Use cutting edge technology, efficient processes and your beautiful imagination in a way that a simple businessperson is effortlessly able to manage business.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="relative w-full aspect-w-4 aspect-h-3  overflow-hidden ">
                <Image 
                  height={400}
                  width={400}
                  src="/Career/why-work-with-us-2.png" 
                  alt="Team members collaborating in the office"
                  objectFit="cover" 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h3 className="font-semibold italic text-lg text-[color:var(--primary-red)] mb-3">
              We have revolutionized SMBs
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed">
              Billing Baba is a mobile-first accounting app that has revolutionised the way small businesses operate. With 80% small businesses still not on any accounting software, we created an easy to use mobile app through which small businesses can manage their entire business - create bills, manage receivables/payables, stop inventory losses, get accounting reports and monitor day-to-day business operations like never before.
              </p>
            </div>
            <div className="w-1/2">
              <div className="relative w-full aspect-w-4 aspect-h-3 overflow-hidden ">
                <Image 
                  height={400}
                  width={400}
                  src="/Career/why-work-with-us-1.png" 
                  alt="Team members collaborating in the office"
                  objectFit="cover" 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-12 lg:gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h3 className="font-semibold italic text-lg text-[color:var(--primary-red)] mb-3">
              Zero to One - Done!
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed">
              With over 10 Million Customers and being one of the highest revenue generating startups in the MSME space, we have scaled up rapidly & sustainably. In the next phase, we’ll bring in more innovations and category defining solutions to help small businesses across the world to grow
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="relative w-full aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden ">
                <Image 
                  height={400}
                  width={400}
                  src="/Career/why-work-with-us-4.png" 
                  alt="Team members collaborating in the office"
                  objectFit="cover" 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyWorkWithUs;