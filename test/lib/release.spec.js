'use strict'

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require('chai').assert,
  leche = require('leche'),
  Release = require('../../lib/release')

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe('Release', () => {
  describe('getPrereleaseVersion()', () => {
    leche.withData(
      [
        ['1.0.0', 'alpha', 'major', '2.0.0-alpha.0'],
        ['1.0.0', 'alpha', 'minor', '1.1.0-alpha.0'],
        ['1.0.0', 'alpha', 'patch', '1.0.1-alpha.0'],

        ['2.0.0-alpha.0', 'alpha', 'major', '2.0.0-alpha.1'],
        ['2.0.0-alpha.0', 'alpha', 'minor', '2.0.0-alpha.1'],
        ['2.0.0-alpha.0', 'alpha', 'patch', '2.0.0-alpha.1'],

        ['2.0.0-alpha.1', 'beta', 'patch', '2.0.0-beta.0'],
      ],
      (version, prereleaseId, releaseType, expected) => {
        it('should return the correct next version', () => {
          const result = Release.getPrereleaseVersion(version, prereleaseId, releaseType)

          assert.strictEqual(result, expected)
        })
      }
    )
  })

  describe('getChangelogCommitRange', () => {
    it('returns an empty string when there are no prior releases', () => {
      const tags = []
      const range = Release.getChangelogCommitRange(tags)

      assert.strictEqual(range, '')
    })

    it('finds the most recent tag for normal releases', () => {
      const tags = ['1.0.0', '1.0.1']
      const range = Release.getChangelogCommitRange(tags)

      assert.strictEqual(range, '1.0.1..HEAD')
    })

    it('finds the most recent tag for prereleases', () => {
      const tags = ['1.0.0', '1.0.1', '2.0.0-alpha.0', '2.0.0-alpha.1']
      const range = Release.getChangelogCommitRange(tags, 'beta')

      assert.strictEqual(range, '2.0.0-alpha.1..HEAD')
    })

    it('finds the last stable tag for a new stable following prereleases', () => {
      const tags = ['1.0.0', '1.0.1', '2.0.0-alpha.0', '2.0.0-rc.0']
      const range = Release.getChangelogCommitRange(tags)

      assert.strictEqual(range, '1.0.1..HEAD')
    })
  })
})
