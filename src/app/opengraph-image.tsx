import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Null Development | Tecnologia para o trabalho real'
export const size = {
	width: 1200,
	height: 630,
}
export const contentType = 'image/png'

export default function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					backgroundColor: '#171A1E',
					padding: '64px',
					fontFamily: 'sans-serif',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
					<div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
						<span
							style={{
								fontSize: '28px',
								fontWeight: 'bold',
								color: '#ffffff',
								letterSpacing: '0.26em',
							}}
						>
							NULL
						</span>
						<span
							style={{
								fontSize: '13px',
								color: '#d4d4d8',
								letterSpacing: '0.32em',
								marginTop: '6px',
							}}
						>
							DEVELOPMENT
						</span>
					</div>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
					<span
						style={{
							fontSize: '16px',
							color: '#c97855',
							letterSpacing: '0.22em',
							textTransform: 'uppercase',
						}}
					>
						DESENVOLVIMENTO SOB MEDIDA
					</span>
					<h1
						style={{
							fontSize: '68px',
							fontWeight: 'bold',
							color: '#ffffff',
							margin: 0,
							letterSpacing: '-1.5px',
							lineHeight: 1.08,
						}}
					>
						Tecnologia para o trabalho real.
					</h1>
					<p
						style={{
							fontSize: '24px',
							color: '#a1a1aa',
							margin: 0,
							maxWidth: '780px',
							lineHeight: 1.45,
						}}
					>
						Software que simplifica processos e conecta o que faz seu negócio acontecer.
					</p>
				</div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						borderTop: '1px solid rgba(255,255,255,0.08)',
						paddingTop: '24px',
						color: '#71717a',
						fontSize: '14px',
						letterSpacing: '0.2em',
					}}
				>
					<span>SISTEMAS SOB MEDIDA · AUTOMAÇÃO · INTEGRAÇÃO</span>
					<span style={{ color: '#c97855' }}>DO SEU DESAFIO À SOLUÇÃO.</span>
				</div>
			</div>
		),
		{
			...size,
		},
	)
}
