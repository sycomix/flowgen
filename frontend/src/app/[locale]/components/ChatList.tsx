import { useTranslations } from 'next-intl';
import { BsInboxes } from 'react-icons/bs';
import { useChat, useChats } from '@/hooks';
import clsx from 'clsx';
import { Float } from '@headlessui-float/react';
import { Popover } from '@headlessui/react';
import { PiChatsCircle } from 'react-icons/pi';
import { GoTrash, GoPencil, GoKebabHorizontal } from 'react-icons/go';
import EditableText from '@/components/EditableText';
import { useState, useEffect, useRef, createRef, forwardRef } from 'react';
import { useRouter } from 'next/navigation';

export const ChatEmpty = () => {
  const t = useTranslations('component.ChatList');
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col gap-2 items-center text-base-content/60">
        <BsInboxes className="w-12 h-12" />
        <div className="mt-2 text-sm">{t('chat-empty')}</div>
      </div>
    </div>
  );
};

export const ChatLoading = () => {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col w-80 h-20 bg-base-content/10 rounded-md p-3 gap-3"
        >
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-1/3" />
        </div>
      ))}
    </>
  );
};

const ContextButton = ({ className, onDelete, onEdit }: any) => {
  const t = useTranslations('component.ChatList');
  const router = useRouter();
  return (
    <Popover>
      <Float
        placement="bottom-start"
        offset={5}
        shift={5}
        flip
        enter="transition ease-out duration-150"
        enterFrom="transform scale-0 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-0 opacity-0"
      >
        <Popover.Button
          onClick={e => e.stopPropagation()}
          className={clsx('hover:text-primary', className)}
        >
          <GoKebabHorizontal className="w-4 h-4" />
        </Popover.Button>
        <Popover.Panel className="origin-top-left w-40 shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-600/80 text-base-content border border-gray-500 max-h-[80vh]">
          {[
            {
              label: t('edit-chat-name'),
              icon: GoPencil,
              onClick: onEdit,
            },
            {
              label: t('delete-chat'),
              icon: GoTrash,
              onClick: onDelete,
              className: 'text-red-500',
            },
          ].map(({ label, icon: Icon, className, onClick }) => (
            <Popover.Button
              key={label}
              className={clsx(
                'flex items-center w-full p-2 gap-2 rounded-md hover:bg-base-content/20 cursor-pointer',
                className
              )}
              onClick={onClick}
            >
              <Icon className="w-4 h-4" />
              <span className="font-normal">{label}</span>
            </Popover.Button>
          ))}
        </Popover.Panel>
      </Float>
    </Popover>
  );
};

interface ChatBlockProps {
  chatId: string;
  disableSelection: boolean;
  className?: string;
  // ... any other props
}

const ChatBlock = forwardRef<HTMLDivElement, ChatBlockProps>(
  ({ chatId, className, disableSelection }: any, ref) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const { chat, isLoading, chatSource } = useChat(chatId);
    const {
      chats,
      setActiveChat,
      activeChat,
      updateChat,
      deleteChat,
    } = useChats();
    const selected = activeChat === chatId && !disableSelection;

    const onEditStarted = () => {
      setIsEditing(true);
    };
    const onEditCompleted = (newText: string) => {
      setIsEditing(false);
      updateChat(chatId, { name: newText });
    };
    const onDelete = async () => {
      if (!chat || !chats) {
        console.warn('Chat not found', chatId);
        return;
      }
      const currentIndex = chats.findIndex(c => c.id === chat.id);
      if (currentIndex < 0) {
        console.warn('Chat not found', chat.id);
        return;
      }
      let nextChatId = '';
      if (currentIndex < chats.length - 1) {
        // Has next one
        nextChatId = chats[currentIndex + 1].id;
      } else if (currentIndex > 1) {
        // The current selection is the last and has previous one
        nextChatId = chats[currentIndex - 1].id;
      }
      setActiveChat(nextChatId);
      await deleteChat(chat.id);
      router.replace(`/chat/${nextChatId}`); // It's fine if nextChatId is empty
    };

    if (!chat || isLoading) return <ChatLoading />;

    return (
      <div
        key={chat.id}
        ref={ref}
        className={clsx(
          'group flex flex-col w-80 justify-center gap-2 text-sm rounded p-2 border cursor-pointer',
          'hover:shadow-box hover:bg-base-content/40 hover:text-base-content hover:border-base-content/30',
          {
            'border-base-content/20 bg-base-content/30 shadow-box shadow-base-content/20': selected,
            'border-base-content/5 bg-base-content/10': !selected,
          },
          className
        )}
        onClick={() => {
          setActiveChat(chat.id);
          router.push(`/chat/${chat.id}`);
        }}
      >
        <div className="flex w-full gap-2 justify-between items-center">
          <div className="flex items-center gap-1">
            <PiChatsCircle className="w-5 h-5 flex-0" />
            <EditableText
              className="font-bold truncate w-64"
              editing={isEditing}
              onChange={onEditCompleted}
              text={chat.name ?? chatSource?.name ?? 'Untitled ' + chat.id}
            />
          </div>
          {selected && (
            <ContextButton
              className="flex-0"
              chat={chat}
              onEdit={onEditStarted}
              onDelete={onDelete}
            />
          )}
        </div>
        <div className="flex items-center gap-2 font-normal">
          <span className="border border-base-content/40 text-base-content/60 rounded p-1 text-xs">
            {chat.sourceType}
          </span>
          <span className="text-base-content/60 line-clamp-1">
            {chatSource?.name ?? ''}
          </span>
        </div>
      </div>
    );
  }
);

ChatBlock.displayName = 'ChatBlock';

const ChatList = ({
  className,
  maxCount,
  horitontal = false,
  disableSelection = false,
}: {
  className?: string;
  maxCount?: number;
  horitontal?: boolean;
  disableSelection?: boolean;
}) => {
  const {
    chats,
    isLoading: isLoadingChats,
    isError: isChatsError,
    activeChat,
  } = useChats();
  const chatListRef = useRef<HTMLDivElement | null>(null); // This ref should attach to the chat list container

  const autoScrollIntoView = (targetElement: any, containerElement: any) => {
    const targetRect = targetElement.getBoundingClientRect();
    const containerRect = containerElement.getBoundingClientRect();

    if (
      targetRect.bottom <= containerRect.top ||
      targetRect.top >= containerRect.bottom
    ) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  const chatRefs = useRef(new Map()).current;
  useEffect(() => {
    if (!chatListRef.current) return;
    if (isLoadingChats) return;
    if (
      activeChat &&
      chatRefs.has(activeChat) &&
      chatRefs.size === chats.length
    ) {
      const activeChatRef = chatRefs.get(activeChat);
      autoScrollIntoView(activeChatRef.current, chatListRef.current);
    }
  }, [isLoadingChats, activeChat, chatRefs.size]);

  if (isChatsError) {
    console.warn('Failed to load chats');
  }
  if (isLoadingChats) return <ChatLoading />;
  if (!chats || chats.length === 0) return <ChatEmpty />;

  let trimmedChats = chats;
  if (maxCount) {
    trimmedChats = trimmedChats.slice(0, maxCount);
  }

  return (
    <div
      ref={chatListRef}
      className={clsx(
        'flex w-full h-full',
        horitontal ? 'flex-wrap justify-center gap-4' : 'flex-col gap-1'
      )}
    >
      {trimmedChats.map((chat: any) => {
        if (!chatRefs.has(chat.id)) {
          chatRefs.set(chat.id, createRef<HTMLDivElement>());
        }
        return (
          <ChatBlock
            key={chat.id}
            ref={chatRefs.get(chat.id)}
            chatId={chat.id}
            className={className}
            disableSelection={disableSelection}
          />
        );
      })}
    </div>
  );
};

export default ChatList;
