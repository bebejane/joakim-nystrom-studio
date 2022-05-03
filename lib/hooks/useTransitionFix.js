import Router from "next/router";
import { useCallback, useEffect, useRef } from "react";

const useTransitionFix = () => {
	const cleanupRef = useRef(() => {});

	useEffect(() => {
		const changeListener = () => {
			// Create a clone of every <style> and <link> that currently affects the page. It doesn't
			// matter if Next.js is going to remove them or not since we are going to remove the copies
			// ourselves later on when the transition finishes.
			const nodes = document.querySelectorAll("link[rel=stylesheet], style:not([media=x])");
			const copies = [...nodes].map((el) => el.cloneNode(true));

			for (let copy of copies) {
				// Remove Next.js' data attributes so the copies are not removed from the DOM in the route
				// change process.
				copy.removeAttribute("data-n-p");
				copy.removeAttribute("data-n-href");

				// Add duplicated nodes to the DOM.
				document.head.appendChild(copy);
			}

			cleanupRef.current = () => {
				for (let copy of copies) {
					// Remove previous page's styles after the transition has finalized.
					document.head.removeChild(copy);
				}
			};
		};

		Router.events.on("beforeHistoryChange", changeListener);

		return () => {
			Router.events.off("beforeHistoryChange", changeListener);
			cleanupRef.current();
		};
	}, []);

	// Return an fixed reference function that calls the internal cleanup reference.
	return useCallback(() => {
		cleanupRef.current();
	}, []);
};


const useTransitionFix2 = () => useEffect(() => {
	// Gather all server-side rendered stylesheet entries.
	let ssrPageStyleSheetsEntries = Array
			.from(document.querySelectorAll('link[rel="stylesheet"][data-n-p]'))
			.map((element) => ({
					element,
					href: element.getAttribute('href'),
			}));

	// Remove the `data-n-p` attribute to prevent Next.js from removing it early.
	ssrPageStyleSheetsEntries.forEach(({ element }) => element.removeAttribute('data-n-p'));

	const fixedStyleHrefs = [];

	const mutationHandler = (mutations) => {
			// Gather all <style data-n-href="/..."> elements.
			const newStyleEntries = mutations
					.filter(({ target }) => target.nodeName === 'STYLE' && target.hasAttribute('data-n-href'))
					.map(({ target }) => ({
							element: target,
							href: target.getAttribute('data-n-href'),
					}));

			// Cycle through them and either:
			// - Remove the `data-n-href` attribute to prevent Next.js from removing it early.
			// - Remove the element if it's already present.
			newStyleEntries.forEach(({ element, href }) => {
					const styleExists = fixedStyleHrefs.includes(href);

					if (styleExists) {
							element.remove();
					} else {
							element.setAttribute('data-fouc-fix-n-href', href);
							element.removeAttribute('data-n-href');
							fixedStyleHrefs.push(href);
					}
			});

			// Cycle through the server-side rendered stylesheets and remove the ones that
			// are already present as inline <style> tags added by Next.js, so that we don't have duplicate styles.
			ssrPageStyleSheetsEntries = ssrPageStyleSheetsEntries.reduce((entries, entry) => {
					const { element, href } = entry;
					const styleExists = fixedStyleHrefs.includes(href);

					if (styleExists) {
							element.remove();
					} else {
							entries.push(entry);
					}

					return entries;
			}, []);
	};

	const observer = new MutationObserver(mutationHandler);

	observer.observe(document.head, {
			subtree: true,
			attributeFilter: ['media'],
	});

	return () => observer.disconnect();
}, []);


const useTransitionFix3 = () => useEffect(() => {
	Array.from(
			document.querySelectorAll('head > link[rel="stylesheet"][data-n-p]')
	).forEach(node => {
			node.removeAttribute('data-n-p');
	});
	const mutationHandler = mutations => {
			mutations.forEach(({ target }) => {
					if (target.nodeName === 'STYLE') {
							if (target.getAttribute('media') === 'x') {
									target.removeAttribute('media');
							}
					}
			});
	};
	const observer = new MutationObserver(mutationHandler);
	observer.observe(document.head, {
			subtree: true,
			attributeFilter: ['media'],
	});
	return () => {
			observer.disconnect();
	};
}, []);


export default useTransitionFix3