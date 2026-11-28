import {
	Document,
	Image,
	Page,
	StyleSheet,
	Text,
	View,
} from '@react-pdf/renderer'
import { formatCurrency, formatDate } from '@/lib/billing-format'
import { company, companyAddress } from '@/lib/company'
import { N3_MARK_DATA_URI } from './brand-mark'

const COPPER = '#C97855'
const CHARCOAL = '#171A1E'
const IVORY = '#F3F1EB'
const STEEL = '#AAB0B4'
const GRAPHITE = '#626B72'
const MUTED = '#7A8189'
const LINE = '#DCDCD6'
const SOFT = '#F6F4EF'

const styles = StyleSheet.create({
	page: {
		fontFamily: 'Helvetica',
		fontSize: 9,
		lineHeight: 1.5,
		color: CHARCOAL,
		padding: 40,
		paddingBottom: 56,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		paddingBottom: 16,
		marginBottom: 24,
		borderBottomWidth: 2,
		borderBottomColor: COPPER,
	},
	brandRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginBottom: 4,
	},
	brandMark: { width: 34, height: 28 },
	brandName: {
		fontSize: 14,
		fontWeight: 700,
		letterSpacing: 2.4,
		lineHeight: 1.1,
	},
	brandSub: {
		fontSize: 7.5,
		fontWeight: 700,
		letterSpacing: 2.2,
		color: GRAPHITE,
		marginTop: 2,
	},
	brandTagline: {
		fontSize: 6.5,
		letterSpacing: 1.2,
		color: STEEL,
		marginTop: 3,
	},
	brandMeta: { fontSize: 7, color: MUTED },
	docLabel: {
		fontSize: 8,
		fontWeight: 700,
		color: COPPER,
		letterSpacing: 1.2,
		textTransform: 'uppercase',
	},
	docNumber: { fontSize: 10, fontWeight: 700, marginTop: 2 },
	title: {
		fontSize: 21,
		fontWeight: 700,
		letterSpacing: -0.6,
		marginBottom: 4,
	},
	subtitle: { fontSize: 9, color: MUTED, marginBottom: 20 },
	sectionTitle: {
		fontSize: 11,
		fontWeight: 700,
		marginBottom: 8,
	},
	box: {
		backgroundColor: SOFT,
		borderRadius: 4,
		padding: 12,
		marginBottom: 18,
	},
	row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
	block: { flex: 1 },
	label: {
		fontSize: 7,
		fontWeight: 700,
		color: MUTED,
		letterSpacing: 1,
		textTransform: 'uppercase',
		marginBottom: 3,
	},
	value: { fontSize: 10, fontWeight: 700 },
	subValue: { fontSize: 8, color: MUTED, marginTop: 2 },
	description: { fontSize: 9, color: '#4B5563' },
	tableHeader: {
		flexDirection: 'row',
		backgroundColor: CHARCOAL,
		borderTopLeftRadius: 3,
		borderTopRightRadius: 3,
		paddingVertical: 7,
		paddingHorizontal: 10,
	},
	tableHeaderCell: {
		color: IVORY,
		fontSize: 7,
		fontWeight: 700,
		letterSpacing: 0.8,
		textTransform: 'uppercase',
	},
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: LINE,
		paddingVertical: 7,
		paddingHorizontal: 10,
	},
	tableAlt: { backgroundColor: SOFT },
	cell: { fontSize: 8 },
	cellRight: { fontSize: 8, textAlign: 'right' },
	colName: { flex: 3 },
	colDesc: { flex: 3 },
	colHours: { flex: 1, textAlign: 'right' },
	colValue: { flex: 1.5, textAlign: 'right' },
	summary: {
		marginLeft: 'auto',
		width: 220,
		marginTop: 16,
		marginBottom: 20,
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 3,
	},
	summaryLabel: { fontSize: 9, color: MUTED },
	summaryValue: { fontSize: 9, fontWeight: 700 },
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: CHARCOAL,
		padding: 10,
		borderRadius: 3,
		marginTop: 6,
	},
	totalLabel: { fontSize: 8, color: IVORY, textTransform: 'uppercase' },
	totalValue: { fontSize: 13, fontWeight: 700, color: IVORY },
	clause: { marginBottom: 14 },
	clauseText: {
		backgroundColor: SOFT,
		borderRadius: 3,
		padding: 10,
		fontSize: 9,
		color: '#4B5563',
	},
	signatures: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 28,
		paddingTop: 18,
		borderTopWidth: 1,
		borderTopColor: LINE,
	},
	signature: { width: '45%' },
	signatureRole: {
		fontSize: 7,
		fontWeight: 700,
		color: MUTED,
		textTransform: 'uppercase',
		letterSpacing: 1,
		marginBottom: 6,
	},
	signatureLine: { borderBottomWidth: 1, borderBottomColor: MUTED, height: 34 },
	signatureName: { fontSize: 8, fontWeight: 700, marginTop: 4 },
	signatureMeta: { fontSize: 7, color: MUTED, marginTop: 2 },
	footer: {
		position: 'absolute',
		bottom: 24,
		left: 40,
		right: 40,
		flexDirection: 'row',
		justifyContent: 'space-between',
		fontSize: 7,
		color: MUTED,
	},
})

export interface PdfQuoteItem {
	name: string
	description?: string | null
	hours: number
	unitValue: number
	monthlyFee: number
	monthlyDuration: number
}

export interface PdfQuote {
	number: string
	title: string
	description?: string | null
	status: string
	clientName: string
	clientEmail?: string | null
	hourlyRate: number
	discount: number
	urgencyFee: number
	entryAmount: number
	installments: number
	totalHours: number
	totalValue: number
	monthlyTotal: number
	expirationDate?: Date | string | null
	signerName?: string | null
	signatureHash?: string | null
	signedAt?: Date | string | null
	items: PdfQuoteItem[]
}

export interface PdfContract {
	number: string
	title: string
	status: string
	clientName: string
	clientEmail?: string | null
	objectClause?: string | null
	timelineClause?: string | null
	paymentClause?: string | null
	ipClause?: string | null
	totalValue: number
	startDate?: Date | string | null
	endDate?: Date | string | null
	providerSigned: boolean
	providerSignerName?: string | null
	providerSignatureHash?: string | null
	clientSigned: boolean
	clientSignerName?: string | null
	clientSignatureHash?: string | null
}

function Header({ label, reference }: { label: string; reference: string }) {
	return (
		<View style={styles.header}>
			<View>
				<View style={styles.brandRow}>
					<Image src={N3_MARK_DATA_URI} style={styles.brandMark} />
					<View>
						<Text style={styles.brandName}>NULL</Text>
						<Text style={styles.brandSub}>DEVELOPMENT</Text>
						<Text style={styles.brandTagline}>
							TECNOLOGIA PARA O TRABALHO REAL
						</Text>
					</View>
				</View>
				<Text style={styles.brandMeta}>
					{company.legalName} · {company.legalStatus}
				</Text>
			</View>
			<View>
				<Text style={styles.docLabel}>{label}</Text>
				<Text style={styles.docNumber}>{reference}</Text>
			</View>
		</View>
	)
}

function Footer({ label }: { label: string }) {
	return (
		<View style={styles.footer} fixed>
			<View>
				<Text>{label} · Null Development</Text>
				<Text>
					CNPJ {company.cnpj} · {companyAddress}
				</Text>
				<Text>
					{company.email} · {company.phone}
				</Text>
			</View>
			<Text
				render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
			/>
		</View>
	)
}

export function QuotePdf({ quote }: { quote: PdfQuote }) {
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<Header label="Proposta comercial" reference={quote.number} />
				<Text style={styles.title}>{quote.title}</Text>
				<Text style={styles.subtitle}>
					Gerada em {formatDate(new Date())} · Validade até{' '}
					{formatDate(quote.expirationDate)}
				</Text>

				<View style={styles.row}>
					<View style={styles.block}>
						<Text style={styles.label}>Contratante</Text>
						<Text style={styles.value}>{quote.clientName}</Text>
						<Text style={styles.subValue}>{quote.clientEmail ?? '—'}</Text>
					</View>
					<View style={styles.block}>
						<Text style={styles.label}>Valor da hora</Text>
						<Text style={styles.value}>{formatCurrency(quote.hourlyRate)}</Text>
						<Text style={styles.subValue}>
							{quote.totalHours} horas estimadas
						</Text>
					</View>
				</View>

				{quote.description ? (
					<View style={styles.box}>
						<Text style={styles.label}>Resumo</Text>
						<Text style={styles.description}>{quote.description}</Text>
					</View>
				) : null}

				<Text style={styles.sectionTitle}>Escopo e investimento</Text>
				<View style={styles.tableHeader}>
					<Text style={[styles.tableHeaderCell, styles.colName]}>Item</Text>
					<Text style={[styles.tableHeaderCell, styles.colDesc]}>Detalhes</Text>
					<Text style={[styles.tableHeaderCell, styles.colHours]}>Horas</Text>
					<Text style={[styles.tableHeaderCell, styles.colValue]}>Valor</Text>
				</View>
				{quote.items.map((item, index) => (
					<View
						key={`${item.name}-${index}`}
						style={
							index % 2 ? [styles.tableRow, styles.tableAlt] : styles.tableRow
						}
					>
						<Text style={[styles.cell, styles.colName]}>{item.name}</Text>
						<Text style={[styles.cell, styles.colDesc]}>
							{item.description ?? '—'}
						</Text>
						<Text style={[styles.cellRight, styles.colHours]}>
							{item.hours}
						</Text>
						<Text style={[styles.cellRight, styles.colValue]}>
							{formatCurrency(item.unitValue)}
						</Text>
					</View>
				))}

				<View style={styles.summary}>
					<View style={styles.summaryRow}>
						<Text style={styles.summaryLabel}>Subtotal</Text>
						<Text style={styles.summaryValue}>
							{formatCurrency(quote.totalHours * quote.hourlyRate)}
						</Text>
					</View>
					{quote.discount > 0 ? (
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Desconto</Text>
							<Text style={styles.summaryValue}>
								-
								{formatCurrency(
									quote.totalHours * quote.hourlyRate * (quote.discount / 100),
								)}
							</Text>
						</View>
					) : null}
					{quote.urgencyFee > 0 ? (
						<View style={styles.summaryRow}>
							<Text style={styles.summaryLabel}>Urgência</Text>
							<Text style={styles.summaryValue}>
								+
								{formatCurrency(
									quote.totalHours *
										quote.hourlyRate *
										(quote.urgencyFee / 100),
								)}
							</Text>
						</View>
					) : null}
					<View style={styles.totalRow}>
						<Text style={styles.totalLabel}>Total</Text>
						<Text style={styles.totalValue}>
							{formatCurrency(quote.totalValue)}
						</Text>
					</View>
				</View>

				<View style={styles.box}>
					<Text style={styles.label}>Condições comerciais</Text>
					<Text style={styles.description}>
						Entrada de {formatCurrency(quote.entryAmount)} ·{' '}
						{quote.installments}x · Mensalidade de{' '}
						{formatCurrency(quote.monthlyTotal)} quando aplicável.
					</Text>
				</View>

				<View style={styles.signatures}>
					<View style={styles.signature}>
						<Text style={styles.signatureRole}>Contratado</Text>
						<View style={styles.signatureLine} />
						<Text style={styles.signatureName}>{company.ownerName}</Text>
						<Text style={styles.signatureMeta}>
							{quote.signatureHash ?? 'Assinatura pendente'}
						</Text>
					</View>
					<View style={styles.signature}>
						<Text style={styles.signatureRole}>Contratante</Text>
						<View style={styles.signatureLine} />
						<Text style={styles.signatureName}>
							{quote.signerName ?? 'Aguardando aprovação'}
						</Text>
						<Text style={styles.signatureMeta}>
							{quote.signedAt ? formatDate(quote.signedAt) : '—'}
						</Text>
					</View>
				</View>

				<Footer label={`Proposta ${quote.number}`} />
			</Page>
		</Document>
	)
}

export function ContractPdf({ contract }: { contract: PdfContract }) {
	const clauses = [
		['Objeto', contract.objectClause],
		['Prazo', contract.timelineClause],
		['Pagamento', contract.paymentClause],
		['Propriedade intelectual', contract.ipClause],
	] as const

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				<Header label="Contrato" reference={contract.number} />
				<Text style={styles.title}>{contract.title}</Text>
				<Text style={styles.subtitle}>
					{formatDate(contract.startDate)} a {formatDate(contract.endDate)}
				</Text>

				<View style={styles.row}>
					<View style={styles.block}>
						<Text style={styles.label}>Contratado</Text>
						<Text style={styles.value}>{company.legalName}</Text>
						<Text style={styles.subValue}>CNPJ {company.cnpj}</Text>
						<Text style={styles.subValue}>{companyAddress}</Text>
						<Text style={styles.subValue}>
							{company.email} · {company.phone}
						</Text>
					</View>
					<View style={styles.block}>
						<Text style={styles.label}>Contratante</Text>
						<Text style={styles.value}>{contract.clientName}</Text>
						<Text style={styles.subValue}>{contract.clientEmail ?? '—'}</Text>
					</View>
				</View>

				{clauses.map(([title, text]) =>
					text ? (
						<View key={title} style={styles.clause}>
							<Text style={styles.sectionTitle}>{title}</Text>
							<Text style={styles.clauseText}>{text}</Text>
						</View>
					) : null,
				)}

				<View style={styles.totalRow}>
					<Text style={styles.totalLabel}>Valor total</Text>
					<Text style={styles.totalValue}>
						{formatCurrency(contract.totalValue)}
					</Text>
				</View>

				<View style={styles.signatures}>
					<View style={styles.signature}>
						<Text style={styles.signatureRole}>Contratado</Text>
						<View style={styles.signatureLine} />
						<Text style={styles.signatureName}>
							{contract.providerSignerName ?? company.ownerName}
						</Text>
						<Text style={styles.signatureMeta}>
							{contract.providerSignatureHash ?? 'Assinatura pendente'}
						</Text>
					</View>
					<View style={styles.signature}>
						<Text style={styles.signatureRole}>Contratante</Text>
						<View style={styles.signatureLine} />
						<Text style={styles.signatureName}>
							{contract.clientSignerName ?? 'Aguardando assinatura'}
						</Text>
						<Text style={styles.signatureMeta}>
							{contract.clientSignatureHash ?? '—'}
						</Text>
					</View>
				</View>

				<Footer label={`Contrato ${contract.number}`} />
			</Page>
		</Document>
	)
}
