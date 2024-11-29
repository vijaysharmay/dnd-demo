import { SetMetadata } from '@nestjs/common';
import { v4 } from 'uuid';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export function cloneBlocksWithChildren(blocks) {
  // Step 1: Create a mapping of old IDs to new IDs
  const idMap = {};
  blocks.forEach((block) => {
    idMap[block.id] = v4(); // Generate new ID for each block
  });

  // Step 2: Define a recursive function to clone blocks
  function cloneBlock(block) {
    const newBlock = {
      ...block,
      id: idMap[block.id], // Replace with new ID
      parentId: block.parentId ? idMap[block.parentId] : null, // Update parentId using mapping
      versionId: v4(), // Optionally generate a new version ID if needed
      children: block.children ? block.children.map(cloneBlock) : [], // Recursively clone children
    };
    return newBlock;
  }

  // Step 3: Clone all top-level blocks
  return blocks.map(cloneBlock);
}
