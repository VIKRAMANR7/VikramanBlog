import { FormEvent, useState } from "react";

export default function NewsLetter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscribed:", email);
    setEmail("");
  };

  return (
    <section
      className="flex flex-col items-center justify-center text-center space-y-2 my-32"
      aria-labelledby="newsletter-heading"
    >
      <h2 id="newsletter-heading" className="md:text-4xl text-2xl font-semibold">
        Never Miss a Blog!
      </h2>

      <p id="newsletter-desc" className="md:text-lg text-gray-500/70 pb-8 max-w-xl">
        Subscribe to get the latest blogs, tech updates, and exclusive news.
      </p>

      <form
        onSubmit={handleSubmit}
        aria-describedby="newsletter-desc"
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>

        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full px-3 rounded-r-none text-gray-500"
        />

        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-md rounded-l-none"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}
