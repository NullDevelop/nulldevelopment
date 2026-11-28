import { notFound } from 'next/navigation'
import { ProposalPublicView } from './_components/proposal-public-view'
import { getPublicProposal } from './_data-access/get-proposal'

export const dynamic = 'force-dynamic'

export default async function PublicProposalPage({
	params,
}: {
	params: Promise<{ token: string }>
}) {
	const { token } = await params
	const proposal = await getPublicProposal(token)

	if (!proposal) notFound()

	return <ProposalPublicView token={proposal.token} quote={proposal.quote} />
}
