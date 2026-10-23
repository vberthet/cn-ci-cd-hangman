import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Gallows } from './Gallows'

describe('Gallows', () => {
  it('draws one body part per wrong guess', () => {
    const { rerender } = render(<Gallows wrongGuesses={0} />)
    expect(screen.getByTestId('gallows-body').children).toHaveLength(0)

    rerender(<Gallows wrongGuesses={6} />)
    expect(screen.getByTestId('gallows-body').children).toHaveLength(6)
  })
})
