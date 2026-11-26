import Image from 'next/image'

interface NullLogoMarkProps {
  className?: string
}

export function NullLogoMark({ className }: NullLogoMarkProps) {
  return (
    <Image
      src="/N3.svg"
      width={645}
      height={537}
      aria-hidden="true"
      alt=""
      className={className}
    />
  )
}

interface NullBrandLogoProps {
  size?: 'sm' | 'md'
}

export function NullBrandLogo({ size = 'md' }: NullBrandLogoProps) {
  const markSize = size === 'sm' ? 'w-9 h-7' : 'w-11 h-8'

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <NullLogoMark className={`${markSize} shrink-0`} />
      <div className="flex flex-col leading-none">
        <span className="text-[16px] sm:text-[17px] font-semibold tracking-[0.26em] text-foreground uppercase">
          NULL
        </span>
        <span className="text-[8.5px] sm:text-[9px] font-medium tracking-[0.34em] text-brand-steel uppercase mt-1">
          DEVELOPMENT
        </span>
        <span className="text-[6px] sm:text-[6.5px] font-medium tracking-[0.22em] text-brand-graphite uppercase mt-1">
          TECNOLOGIA PARA O TRABALHO REAL
        </span>
      </div>
    </div>
  )
}
