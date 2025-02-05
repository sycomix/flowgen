import clsx from 'clsx';
import React, { memo, useEffect, useState } from 'react';
import Toolbar from './Toolbar';
import { GoCheck, GoPencil, GoX } from 'react-icons/go';
import { NodeResizeControl, useReactFlow } from 'reactflow';
import Markdown from '@/components/Markdown';
import { getNodeLabel, setNodeData } from '../../utils/flow';
import { FaNoteSticky } from 'react-icons/fa6';
import CopyButton from '@/components/CopyButton';
import { useTranslations } from 'next-intl';

const ResizeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', right: 0, bottom: 0 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
};

function Note({ id, data, selected, ...props }: any) {
  const instance = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(data.content);
  const t = useTranslations('node.Note');
  const tNodeMeta = useTranslations('meta.node');

  useEffect(() => setContent(data.content), [data.content]);

  return (
    <div
      className={clsx(
        'w-full h-full p-2 rounded-md border text-orange-100 backdrop-blur-md',
        selected
          ? 'border-yellow-600/60 bg-yellow-500/60'
          : 'border-yellow-700/40 bg-yellow-500/50'
      )}
    >
      <Toolbar
        nodeId={id}
        selected={selected}
        className="border-yellow-600/60 bg-yellow-500/60"
      >
        <CopyButton
          content={content}
          place="top"
          className="hover:text-white"
          minimal
        />
      </Toolbar>
      <div className="relative flex flex-col w-full h-full gap-2 text-sm">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center">
              <FaNoteSticky className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold">
              {getNodeLabel(data.label, tNodeMeta)}
            </div>
          </div>
          {editing ? (
            <div className="flex items-center gap-2">
              <button
                className="btn btn-xs btn-ghost btn-square"
                onClick={() => setEditing(!editing)}
              >
                <GoX className="text-red-500 w-4 h-4" />
              </button>
              <button
                className="btn btn-xs btn-ghost btn-square"
                onClick={e => {
                  setEditing(false);
                  setNodeData(instance, id, { content: content });
                }}
              >
                <GoCheck className="text-green-500 w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-xs btn-ghost btn-square"
              onClick={() => setEditing(!editing)}
            >
              <GoPencil className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="w-full h-full text-sm text-white/80 overflow-y-auto">
          {editing && (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={t('note-placeholder')}
              className="nodrag textarea w-full h-full p-1 bg-base-content/20 rounded resize-none"
              rows={6}
            />
          )}
          {!editing && (
            <Markdown className="nodrag">
              {data.content ?? t('note-blank')}
            </Markdown>
          )}
        </div>
        <NodeResizeControl
          nodeId={id}
          minWidth={240}
          minHeight={120}
          className={clsx({ hidden: !selected })}
          style={{
            background: 'transparent',
            border: 'none',
          }}
        >
          <ResizeIcon />
        </NodeResizeControl>
      </div>
    </div>
  );
}

export default memo(Note);
