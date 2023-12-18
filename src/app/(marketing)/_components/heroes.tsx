import Image from 'next/image'

const Heroes = () => (
  <div className="flex flex-col justify-center items-center max-w-5xl">
    <div className="flex items-center">
      <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
        <Image
          src="/documents.png"
          alt="Documents"
          fill
          className="object-contain dark:hidden"
        />

        <Image
          src="/documents-dark.png"
          alt="Documents"
          fill
          className="hidden dark:block object-contain"
        />
      </div>

      <div className="relative hidden md:block w-[400px] h-[400px]">
        <Image
          src="/reading.png"
          alt="Reading"
          fill
          className="dark:hidden object-contain"
        />

        <Image
          src="/reading-dark.png"
          alt="Reading"
          fill
          className="hidden dark:block object-contain"
        />
      </div>
    </div>
  </div>
)
export default Heroes
