import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { GoTrash } from 'react-icons/go';
import { Position, NodeToolbar, useReactFlow } from 'reactflow';

const Toolbar = ({
  nodeId,
  selected,
  hideDelete,
  children,
  className,
}: any) => {
  const reactFlowInstance = useReactFlow();
  const t = useTranslations('node.Toolbar');
  const onDelete = (e: any) => {
    console.log('deleting', nodeId);
    e.stopPropagation();

    const node = reactFlowInstance.getNode(nodeId);
    if (!node) {
      console.warn('The node to delete does not exist', nodeId);
      return;
    }
    reactFlowInstance.deleteElements({ nodes: [node] });
  };

  return (
    <NodeToolbar
      isVisible={selected}
      position={Position.Top}
      align="end"
      className={clsx(
        className,
        'flex items-center gap-3 p-1 rounded bg-gray-600/90 border border-gray-500'
      )}
    >
      {children}
      {!hideDelete && (
        <button
          className="flex items-center justify-center hover:text-red-600"
          data-tooltip-content={t('delete-node-tooltip')}
          data-tooltip-id="default-tooltip"
          data-tooltip-place="top"
          onClick={onDelete}
        >
          <GoTrash className="w-4 h-4" />
        </button>
      )}
    </NodeToolbar>
  );
};

export default Toolbar;
