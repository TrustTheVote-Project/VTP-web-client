const = tallyContestJSON = `
#
# tally a RCV contest using the voter's row
#
% tally-contests -c 0001 -t 383bf5d91f8ce8a96af9079a5103001695c6fccb,fca7248862b181a383d79d9fa6c9341de49a1318,d06cf8fab59e08e1f5b597cfd2a1fadebfbe9cbf,35dcbaddbf351c2444d77c1bf6d044747af26123,ef56c5db943e29dee54499085389b2a5faaaa05b
Running "git rev-parse --show-toplevel"
Running "git rev-list --max-parents=0 HEAD"
Running "git pull"
Already up to date.
Running "git log --topo-order --no-merges --pretty=format:%H%B"
Scanned 148 contests for contest (U.S. Senate) uid=0001, tally=rcv, max=1, win-by>0.5

RCV: round 0
Counted fca7248862b181a383d79d9fa6c9341de49a1318: choice=Gloria Gamma
Total vote count: 148
Francis Foxtrot: 31
Anthony Alpha: 29
Betty Beta: 28
David Delta: 21
Emily Echo: 21
Gloria Gamma: 18

RCV: round 1
RCV: fca7248862b181a383d79d9fa6c9341de49a1318 (contest=U.S. Senate) last place pop and count (Gloria Gamma -> David Delta)
Total vote count: 148
Francis Foxtrot: 34
Betty Beta: 33
Anthony Alpha: 31
Emily Echo: 27
David Delta: 23
Gloria Gamma: 0

RCV: round 2
RCV: fca7248862b181a383d79d9fa6c9341de49a1318 (contest=U.S. Senate) last place pop and count (David Delta -> Francis Foxtrot)
Total vote count: 148
Francis Foxtrot: 45
Anthony Alpha: 35
Betty Beta: 35
Emily Echo: 33
David Delta: 0
Gloria Gamma: 0

RCV: round 3
Total vote count: 146
Francis Foxtrot: 56
Anthony Alpha: 47
Betty Beta: 43
Emily Echo: 0
David Delta: 0
Gloria Gamma: 0

RCV: round 4
Total vote count: 144
Final results for contest U.S. Senate (uid=0001):
Francis Foxtrot: 80
Anthony Alpha: 64
Betty Beta: 0
Emily Echo: 0
David Delta: 0
Gloria Gamma: 0
