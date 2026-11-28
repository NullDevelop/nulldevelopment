import { notFound } from 'next/navigation'
import { ContractPublicView } from './_components/contract-public-view'
import { getPublicContract } from './_data-access/get-contract'

export const dynamic = 'force-dynamic'

export default async function PublicContractPage({
	params,
}: {
	params: Promise<{ token: string }>
}) {
	const { token } = await params
	const proposal = await getPublicContract(token)

	if (!proposal) notFound()

	return (
		<ContractPublicView token={proposal.token} contract={proposal.contract} />
	)
}
