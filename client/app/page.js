import Image from "next/image";

export default function Home() {
  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-y-auto"
      style={{ height: "calc(100svh - 69.6px)" }}
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              app/page.js
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
          blanditiis molestiae qui repudiandae aspernatur mollitia cupiditate
          optio asperiores corrupti accusantium consectetur exercitationem
          dignissimos beatae facilis ipsam nihil laboriosam quis esse corporis,
          dolor reiciendis fugiat nemo! Dolor voluptatem doloribus architecto ex
          tenetur suscipit facilis modi. Atque voluptatum sequi earum libero
          commodi consectetur velit, repudiandae, rem labore cumque ducimus! Id
          voluptate quod consectetur quasi cumque, neque optio architecto eius
          blanditiis. Sunt obcaecati ex, delectus, doloribus officiis eos
          perferendis consequatur sapiente non nam consequuntur odio autem iste
          libero eaque. Accusamus corporis totam cupiditate nam maxime fuga
          provident exercitationem laborum optio ipsum, nihil asperiores
          voluptate, illum quidem, libero reprehenderit qui aut iusto. Itaque
          similique temporibus modi magnam excepturi fugit! Magnam omnis at,
          nisi facere sequi cumque, aperiam nesciunt blanditiis libero odio
          alias adipisci dolorum et eius deleniti? Libero ipsam, reiciendis
          doloremque numquam consequatur nihil placeat aspernatur voluptatibus
          praesentium maxime asperiores nam consectetur similique perspiciatis,
          necessitatibus qui est possimus laboriosam ducimus impedit quisquam
          excepturi vero facere eaque. Quibusdam tenetur quo sed nesciunt
          exercitationem nam deserunt alias dolore possimus ex accusantium earum
          asperiores, odit animi quod ut inventore pariatur maxime ipsam
          corporis esse assumenda laborum eligendi cupiditate! Doloremque nemo
          ipsum qui facilis, distinctio inventore porro soluta quis repellendus
          dolores nesciunt expedita debitis, facere recusandae, eveniet magnam
          at consectetur nobis tempore in aliquid illum voluptatum voluptates
          quas? Hic voluptates fugiat numquam natus aperiam assumenda veniam
          quas expedita, dolore temporibus at iure eligendi corrupti laborum,
          soluta explicabo cumque repudiandae ad enim. At cupiditate minima
          maxime aspernatur blanditiis, saepe corporis temporibus adipisci
          veniam? Aliquid rem commodi sint doloremque voluptas provident velit
          dolorem nam modi cumque aperiam exercitationem, ipsam saepe nihil qui
          illum! Possimus expedita id modi? Praesentium laborum eaque cumque
          reprehenderit repellat, molestias earum aspernatur tempora veniam rem
          tempore libero maiores alias sequi labore recusandae cupiditate
          magnam, illum dolor!
        </p>
      </footer>
    </div>
  );
}
