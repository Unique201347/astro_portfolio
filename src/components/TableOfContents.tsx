// @ts-nocheck
import { useEffect, useRef, useState } from "preact/hooks";

function TableOfContents(props) {
  const headers = props.headings.filter((f) => f.depth < 4);
  const [activeId, setActiveId] = useState();
  useIntersectionObserver(setActiveId);

  const scrollToHeading = (e) => {
    e.preventDefault();
    if (e.target.href) {
      document
        .querySelector(`#${e.target.getAttribute("data-attr-id")}`)
        .scrollIntoView({
          behavior: "smooth",
        });
    }
  };

  return (
    <>
      {headers.length > 0 && (
        <nav aria-label="Table of Contents" className=" border p-4">
          <ul className="flex-col py-2">
            {headers.map((header) => {
              const className = [
                `link--level${header.depth}`,
                header.slug === activeId ? "link--active" : "",
              ].join(" ");

              const isActive = header.slug === activeId;

              return (
                <li
                  className={`text-sm py-2 px-4 border-l-4 ${
                    isActive ? "border-neonPink" : "border-transparent"
                  } ${className}`}
                >
                  <a
                    href={`#${header.slug}`}
                    data-attr-id={header.slug}
                    onClick={scrollToHeading}
                    className={`text-gray-400 hover:text-gray-100 ${
                      isActive ? "text-gray-100" : ""
                    }`}
                  >
                    {header.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
}

export default TableOfContents;

const useIntersectionObserver = (setActiveId) => {
  const headingElementsRef = useRef({});
  useEffect(() => {
    const callback = (headings) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement;
        return map;
      }, headingElementsRef.current);

      const visibleHeadings = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id) =>
        headingElements.findIndex((heading) => heading.id === id);

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id)
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px 0px -30% 0px",
    });

    const headingElements = Array.from(document.querySelectorAll("h2, h3"));

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [setActiveId]);
};
