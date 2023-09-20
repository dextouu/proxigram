import { useRouter } from "next/router";
import { Layout } from "../layouts/Layout";
import { SearchForm } from "../SearchForm";
import { ErrorMessage } from "./ErrorMessage";

type Props = {
	statusCode: number;
};

export function ErrorInfo({ statusCode }: Props) {
	const {
		asPath,
		query: { tag },
	} = useRouter();

	const is404 = statusCode === 404;
	const is403 = statusCode === 403;
	const is504 = statusCode === 504;

	const originalUrl = tag
		? `https://instagram.com/explorer/tag/${tag}`
		: `https://instagram.com${asPath}`;
	const msg = is403
		? "This instance is being blocked"
		: is404
		? "We couldn't find what you are looking for"
		: is504
		? "The provider chosen, didn't respond"
		: "Something went wrong...";

	return (
		<Layout
			meta={{
				title: msg,
				description: msg,
			}}
			className="h-screen p-8 flex flex-col items-center"
		>
			{is404 ? (
				<ErrorMessage
					originalUrl={originalUrl}
					statusCode={statusCode}
					includeInstances={false}
					title="We couldn't find what you are looking for"
				>
					<>
						You can try again:
						<SearchForm />
					</>
				</ErrorMessage>
			) : is403 ? (
				<ErrorMessage
					originalUrl={originalUrl}
					statusCode={statusCode}
					title="This instance is being blocked"
				>
					You could try refreshing the page to select another random provider or
					you could:
				</ErrorMessage>
			) : is504 ? (
				<ErrorMessage
					originalUrl={originalUrl}
					statusCode={statusCode}
					title="The provider chosen, didn't respond"
				>
					You could try refreshing the page to select another random provider or
					you could
				</ErrorMessage>
			) : (
				<ErrorMessage
					originalUrl={originalUrl}
					statusCode={statusCode}
					title="Something went wrong..."
				>
					You could try refreshing the page to select another random provider or
					you could:
				</ErrorMessage>
			)}
		</Layout>
	);
}
