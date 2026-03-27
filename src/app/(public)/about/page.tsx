import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getTeamMembers } from "@/lib/queries/team";

export const metadata: Metadata = {
  title: "About Us - HerbalWisdom",
  description:
    "Learn about our mission to preserve and share traditional herbal wisdom for modern wellness.",
};

const traditions = [
  {
    title: "Ancient Wisdom",
    desc: "Drawing from texts dating back to the 16th century, we revive lost remedies that have stood the test of time.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOOn-JJcKUI5gDC9PUjbE--G1WhDYrcivi32TqdY2XMuacnndgpuQ1pV8TbLeCTzZ5pLc7r4MZFaHrOJvvEhBRWO1nIUOXfJYeBqZYu_6WUIsM-XRMOrJptecycLIMpRnSfpJeY5zIcYjgmVqVbbG0Npz_ps2c3MfmdsoynuLGLgYUTonbzs_Js3nV0OG_PRLCZpMCp_kjCvtMLjtq-uPCxMt9Ego2dA1U8igTqHiWnQ7MLVK23ZtU8JQq3VIDL93GmVsQQRVfC-o",
  },
  {
    title: "Modern Science",
    desc: "We validate traditional claims with current phytochemical research and collaborate with botanists.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjFY5PiLn-5inZKi1Anb0grDpc3_5MXb9ulD8wyyw2UbeyBH69AfJ7clU0jiadUCHzHSxAWzZ5r08npLoHLUVhN6raCWACTjGFW6O1I5n953w5jgqzZQhD_TVg2ojmgfih0-cCNml6gq2giPxcQIlofftFnYZR6nNIHUv_0kVlyxb-q_8e45rXimZ7lQ5pB3AgHUnARgyDO2rxA7M_GSmKA6D2pAmINzsYt6ySG0UbiCETH9txSIQMMkBPdR3cH2GiIzdxvSJ5pUg",
  },
  {
    title: "Earth Stewardship",
    desc: "A portion of all proceeds goes to regenerating native plant habitats and supporting organic farmers.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBEcWivAh5NgmPtC3SfYgNHgLqku-7_PneOYfd592lXgGruysqiXuKssrJSddeFOZwjQSk8-9p-9mOyiziGTJ46P0YNl7sZ1PVmie6JKcWJOJrW6TsTgAGxDhqA-PxLiYBSYFwhER2Ny5JdNmohPuNEEwnp32HDvIpiX-HDljL6zkbmvqyBgX4S8QhdMfz9RPSDMtPU906KywautmIcc_uO63ZHRD4R2a7WCrmt0X-ve9CpEihsTRNqrrfs5pSuAN_SVL3XrX_e4fA",
  },
];

export default async function AboutPage() {
  const dbTeam = await getTeamMembers();
  const team = dbTeam.map((m: any) => ({
    name: m.name,
    role: m.role,
    bio: m.bio,
    image: m.image,
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply z-10" />
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPidraaHnbAATk7Qs0-w6WwtUy8txoLvCCjw08DeyWob3PdyfnwF9aJ7IVeGqvVh3JO7ktm1KuthEgrSIfgfTyjR7-x_Ap5tT8s839u4aOyve9iFdV8e0cuSGgcfAy6w5ah3Oe8JKhwQt2-U5JuyLZIx7UlHGroAviIZGAGxu-D8c_NaFt5RPvwSx1vC7jsyx7HRmMppauezfxXWY1lcv53-w62bDrqdroaaghFj0wAeCOSKQjbgUo0CBKO6yVTC4pSBLzTC5Fyok"
            alt="Serene herbal garden with sunlight filtering through leaves"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-center text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest mb-6">
            Established 1985
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 drop-shadow-md">
            Rooted in Nature,
            <br />
            Guided by Tradition
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light leading-relaxed drop-shadow-sm">
            We bridge the gap between ancient herbal wisdom and modern wellness,
            cultivating a deeper connection with the healing power of plants.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-32 px-4 bg-surface relative overflow-hidden">
        <div className="absolute -left-20 top-20 opacity-5 pointer-events-none rotate-12">
          <span className="material-symbols-outlined text-[400px]">eco</span>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full border border-primary/20 rounded-xl z-0" />
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEcWivAh5NgmPtC3SfYgNHgLqku-7_PneOYfd592lXgGruysqiXuKssrJSddeFOZwjQSk8-9p-9mOyiziGTJ46P0YNl7sZ1PVmie6JKcWJOJrW6TsTgAGxDhqA-PxLiYBSYFwhER2Ny5JdNmohPuNEEwnp32HDvIpiX-HDljL6zkbmvqyBgX4S8QhdMfz9RPSDMtPU906KywautmIcc_uO63ZHRD4R2a7WCrmt0X-ve9CpEihsTRNqrrfs5pSuAN_SVL3XrX_e4fA"
                  alt="Hands preparing herbal mixture"
                  width={600}
                  height={500}
                  className="relative z-10 rounded-xl shadow-xl w-full object-cover h-[500px]"
                />
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase">
                Our Mission
              </h2>
              <h3 className="text-3xl md:text-4xl font-serif text-text-main leading-tight">
                Preserving the sanctity of plant medicine for future generations.
              </h3>
              <p className="text-on-surface/60 leading-relaxed text-lg">
                At HerbalWisdom, we believe that the earth provides everything
                we need to heal. Our mission is to catalogue, preserve, and
                share the knowledge of traditional herbalism passed down through
                centuries.
              </p>
              <p className="text-on-surface/60 leading-relaxed">
                We are committed to ethical sourcing, sustainability, and
                education. Every remedy we feature is backed by both historical
                usage and contemporary understanding.
              </p>
              <div className="pt-4 grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-3xl font-serif text-primary mb-1">500+</h4>
                  <p className="text-sm text-on-surface/40">Botanicals Cataloged</p>
                </div>
                <div>
                  <h4 className="text-3xl font-serif text-primary mb-1">100%</h4>
                  <p className="text-sm text-on-surface/40">Ethically Sourced</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tradition */}
      <section className="py-24 px-4 bg-accent/30 border-y border-primary/10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="material-symbols-outlined text-4xl text-primary/60 mb-4">
            history_edu
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-main mb-6">
            Our Tradition
          </h2>
          <p className="text-lg text-on-surface/60 max-w-2xl mx-auto">
            Founded on the principles of Western Herbalism and Ayurveda, our
            practice respects the lineages that came before us.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {traditions.map((item, i) => (
            <div
              key={item.title}
              className={`bg-surface-container-lowest p-8 rounded-t-full rounded-b-xl text-center border border-outline-variant/10 shadow-sm hover:shadow-ambient transition-all duration-300 group ${i === 1 ? "relative md:-mt-8" : ""}`}
            >
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-accent shadow-inner">
                <Image src={item.image} alt={item.title} width={128} height={128} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-serif font-bold text-text-main mb-3">{item.title}</h3>
              <p className="text-on-surface/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-2">Our Team</h2>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-text-main">Meet the Herbalists</h3>
              <p className="mt-4 text-on-surface/50">
                Our collective includes certified clinical herbalists, botanists, and holistic practitioners.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="group">
                <div className="aspect-[3/4] overflow-hidden rounded-xl mb-4 bg-surface-container-low relative">
                  <Image src={member.image} alt={member.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex gap-2">
                      <button className="size-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur text-white flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-sm">mail</span>
                      </button>
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-serif font-bold text-text-main">{member.name}</h4>
                <p className="text-sm text-primary font-medium">{member.role}</p>
                <p className="text-xs text-on-surface/40 mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 gradient-primary text-white text-center">
        <div className="max-w-3xl mx-auto">
          <span className="material-symbols-outlined text-5xl mb-6 opacity-80">volunteer_activism</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Begin Your Journey With Us</h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 font-light">
            Whether you seek a specific remedy or wish to learn the art of herbalism, our door is always open.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/remedies" className="px-8 py-3 bg-white text-primary font-bold rounded-full hover:bg-surface-container-low transition-colors shadow-lg">
              Browse Apothecary
            </Link>
            <button className="px-8 py-3 bg-transparent border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-colors">
              Join Workshops
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
