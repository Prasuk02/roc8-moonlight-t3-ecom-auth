import Link from "next/link";

export default async function Home() {
  return (
    <main className="w-full h-full flex items-center justify-center">
      <section className="text-center">
        {/* Header */}
        <h1 className="text-3xl font-bold capitalize">Welcome to roc8 🚀 moonshot ecommerce</h1>

        <div className="mt-5">
          <p className="text-base font-medium">Click to Explore Page ⬇️</p>
          {/* Quick Links */}
          <div className="mt-2 flex items-center justify-center gap-3 font-semibold text-base">
            <Link href='/login' className="underline underline-offset-2 text-[#222222]">Login</Link>
            <span className="text-[#999999]">|</span>
            <Link href='signup' className="underline underline-offset-2 text-[#222222]">Signup</Link>
            <span className="text-[#999999]">|</span>
            <Link href='/categories' className="underline underline-offset-2 text-[#222222]">Categories</Link>
          </div>
        </div>

      </section>
    </main>
  );
}
