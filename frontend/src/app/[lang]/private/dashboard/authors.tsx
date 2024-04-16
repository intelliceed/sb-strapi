'use client';

// outsource dependencies
import cn from "classnames";
import Image from "next/image";
import { useState } from "react";
import { Dialog } from "@headlessui/react";

// local dependencies
import { Author } from "@/app/types/author";
import { getStrapiMedia } from "@/app/[lang]/utils/api-helpers";
import { ModalWindow } from "@/app/[lang]/components/ModalWindow";

type AuthorsProps = {
  className?: string,
  authors?: Array<Author>,
  wrapperClassName?: string,
}

export function Authors ({ authors, className = '', wrapperClassName = '' }: AuthorsProps) {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | undefined | null>(null);
  const [isModalWindowOpened, setIsModalWindowOpened] = useState<boolean>(false);

  const handleSelectAuthor = (author: Author) => {
    setSelectedAuthor(author);
    setIsModalWindowOpened(true);
  };
  const handleCloseModal = () => setIsModalWindowOpened(false);
  const handleClearSelectedAuthor = () => setSelectedAuthor(null);

  return <>
    <div className={cn("flex w-full", wrapperClassName)}>
      <ModalWindow
        toggle={handleCloseModal}
        isOpen={isModalWindowOpened}
        afterLeave={handleClearSelectedAuthor}
      >
        <>
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Author's brief profile
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{selectedAuthor?.attributes.name}</p>
            <p className="text-sm text-gray-500">{selectedAuthor?.attributes.email}</p>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Got it, thanks!
            </button>
          </div>
        </>
      </ModalWindow>
      <div className="flex space-x-1">
        {authors?.map(({ id, attributes }) => {
          const { url, alternativeText } = attributes.avatar.data.attributes;
          const avatarUrl = getStrapiMedia(url);
          return <button key={id} className={className} onClick={() => handleSelectAuthor({ id, attributes })}>
            {avatarUrl &&
              <Image title={attributes.name} src={avatarUrl} alt={alternativeText} width={60} height={60} className="rounded-full aspect-square object-cover" />}
          </button>;
        })}
      </div>
    </div>
  </>;
}
