# Bitcoin + Counterparty Node Setup

---

## Machine

Only tested on Ubuntu, the OS the following setup is based on. Setups for other operating systems can be found in the "[official](https://counterparty.io/docs/federated_node/)", but no longer [minimal](https://github.com/CNTRPRTY/federatednode/tree/master#readme), setup documentation.

The lowest specifications tested are 8GB of RAM and 1TB disk, but lower specs could still work.

### Example machine: AWS EC2 instance

First you must know [how to](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/get-set-up-for-amazon-ec2.html) setup and connect to an AWS EC2 instance.

Then, you can use instance settings like the following:

- OS image: Ubuntu, 20.04 LTS, amd64
- Instance type: t2.large (2vCPU 8GB)
- Storage: 1000GB

---

## Fednode installation (simple)

Connect through SSH to your newly created instance. Then write the following commands, divided in 3 parts.

(A more optimal, but optional, setup is also provided with addtional steps. This optimal setup will help you have a Bitcoin + Counterparty node synced and ready to use faster.)

Note that lines starting with `#` are comments.

### I. First part:

```
sudo apt-get update && sudo apt-get -y upgrade

sudo apt-get -y install git curl coreutils

curl -fsSL https://get.docker.com -o get-docker.sh

sudo sh get-docker.sh

sudo adduser ubuntu docker
```

### II. Second part (choose project to git clone):

```
# The first option is a 'Core Version' which the rest of the steps follow

git clone https://github.com/CNTRPRTY/federatednode.git

# OR

# The following is the "official" setup (which you should follow its instructions instead, available at https://counterparty.io/docs/federated_node/)

git clone https://github.com/CounterpartyXCP/federatednode.git
```

All next steps assume the CNTRPRTY option was chosen.

### III. Third part:

```
cd federatednode

sudo ln -sf `pwd`/fednode.py /usr/local/bin/fednode

fednode install
```
```
# After the install is done, check all services are STATUS 'Up ...'

fednode ps
```
```
# Continue checking until sync is completed: '[INFO] Block: <block_is_tip> (Xs, hashes: L:X / TX:X / M:X)'

# To close the following 'tail' commands, press CTRL+C

fednode tail counterparty

# WILL SHOW:
#
# [INFO] AddrIndexRs connecting...
# counterparty_1          | [2023-XX-XX XX:XX:XX]
# [INFO] Error connecting to AddrIndexRs! Retrying in a few seconds
#
# UNTIL 'bitcoin' syncs (then 'addrindexrs', which is much faster than bitcoin)

fednode tail bitcoin

fednode tail addrindexrs
```

---

## Fednode installation additional (optional but optimal) steps

Complete the 3 parts above, then:

### IV. Fourth part, focus on Bitcoin syncing before anything else (choose between mainnet or testnet):

```
# Stop all services

fednode stop

# You can continue using 'fednode ps' to see the status of all fednode services
```
```
# Then, focus on only syncing Bitcoin (mainnet or testnet)


# mainnet

fednode start bitcoin

# OR testnet

fednode start bitcoin-testnet


# You could do both at the same time, but it is less optimal
```

### V. Fifth part, optimization of the Bitcoin sync (assumes the mainnet only option was chosen) (you can skip this step entirely if you are uncertain):

```
# The following commands are directly connected to the RAM of the machine

# Notice these changes are reverted after the initial block download sync is complete, if this revert is not done, you might end up with a LESS optimal machine
```
```
# Add dbcache based on your machine specs, 'dbcache=5000' should be fine for 8GB RAM if no other services are running

pico config/bitcoin/bitcoin.conf


# Add the following line at the end (below 'txindex=1')

txindex=1
dbcache=5000

# Save and close: CTRL+X, Y, Enter


fednode restart bitcoin
```
```
# Continue checking until sync is completed, which should take around 3 days to reach 'progress=1.000000'

fednode tail bitcoin

# Close 'tail' commands with CTRL+C
```
```
# After Bitcoin is synced ('progress=1.000000') REVERT the addition of dbcache:

cd federatednode

pico config/bitcoin/bitcoin.conf


# Comment (or delete) added dbcache '#dbcache=5000'

txindex=1
#dbcache=5000

# Save and close: CTRL+X, Y, Enter


fednode restart bitcoin
```

### VI. Sixth part, start the rest of the required services:

```
# Confirm the Bitcoin sync is completed: 'progress=1.000000'

fednode tail bitcoin

# Close 'tail' commands with CTRL+C
```
```
fednode start addrindexrs

# Check both 'bitcoin' and 'addrindexrs' are STATUS 'Up ...'

fednode ps

# Tail 'addrindexrs' until it is reading from mempool: 'updated mempool with X transactions from daemon'

fednode tail addrindexrs
```
```
# Finally, start Counterparty

fednode start counterparty

# Continue checking until sync is completed: '[INFO] Block: <block_is_tip> (Xs, hashes: L:X / TX:X / M:X)'

fednode tail counterparty
```
