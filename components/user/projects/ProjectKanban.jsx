import React from 'react'
import Board from '@asseinfo/react-kanban'

function ProjectKanban({ }) {

    const board1 = {
        columns: [
            {
                id: 1,
                title: 'Backlog',
                cards: [
                    {
                        id: 1,
                        title: 'Add card',
                        description: 'Add capability to add a card in a column'
                    },
                ]
            },
            {
                id: 2,
                title: 'Doing',
                cards: [
                    {
                        id: 2,
                        title: 'Drag-n-drop support',
                        description: 'Move a card between the columns'
                    },
                ]
            }
        ]
    }
    return (
        <Board initialBoard={board1} />
    )
}

export default ProjectKanban