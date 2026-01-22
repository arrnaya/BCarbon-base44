/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserCheck, UserX, Crown, Plus, Trash2, RefreshCw } from 'lucide-react';
import { GOVERNANCE_ADDRESS, chainInfo } from '@/components/contract/address';
import { useActiveAccount } from 'thirdweb/react';

// Governance ABI - only the methods we need
const GOVERNANCE_ABI = [
    "function owner() view returns (address)",
    "function getAuthorizedValidators() view returns (address[])",
    "function getAuthorizedVerifiers() view returns (address[])",
    "function checkAuthorizedValidators(address) view returns (bool)",
    "function checkAuthorizedVerifiers(address) view returns (bool)",
    "function addValidator(address validator)",
    "function addVerifier(address verifier)",
    "function removeValidator(address validator)",
    "function removeVerifier(address verifier)"
];

export default function AdminRoleManagement() {
    const [owner, setOwner] = useState('');
    const [validators, setValidators] = useState([]);
    const [verifiers, setVerifiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    // Form states
    const [newValidatorAddress, setNewValidatorAddress] = useState('');
    const [newVerifierAddress, setNewVerifierAddress] = useState('');
    const [processing, setProcessing] = useState(false);

    const { toast } = useToast();
    const activeAccount = useActiveAccount();
    const walletAddress = activeAccount?.address;

    useEffect(() => {
        loadRoleHolders();
    }, []);

    useEffect(() => {
        if (walletAddress && owner) {
            setIsOwner(walletAddress.toLowerCase() === owner.toLowerCase());
        }
    }, [walletAddress, owner]);

    const getProvider = () => {
        return new ethers.JsonRpcProvider(chainInfo.rpc);
    };

    const getSigner = async () => {
        if (!window.ethereum) {
            throw new Error('Please install MetaMask');
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        return await provider.getSigner();
    };

    const loadRoleHolders = async () => {
        try {
            setLoading(true);
            const provider = getProvider();
            const contract = new ethers.Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, provider);

            const [ownerAddr, validatorsList, verifiersList] = await Promise.all([
                contract.owner(),
                contract.getAuthorizedValidators(),
                contract.getAuthorizedVerifiers()
            ]);

            setOwner(ownerAddr);
            setValidators(validatorsList);
            setVerifiers(verifiersList);
        } catch (error) {
            console.error('Error loading role holders:', error);
            toast({
                title: "Error",
                description: "Failed to load role holders",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const addValidator = async () => {
        if (!ethers.isAddress(newValidatorAddress)) {
            toast({
                title: "Invalid Address",
                description: "Please enter a valid Ethereum address",
                variant: "destructive"
            });
            return;
        }

        try {
            setProcessing(true);
            const signer = await getSigner();
            const contract = new ethers.Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, signer);

            const tx = await contract.addValidator(newValidatorAddress);

            toast({
                title: "Transaction Submitted",
                description: "Adding validator... Please wait for confirmation.",
            });

            await tx.wait();

            toast({
                title: "Success",
                description: `Validator ${newValidatorAddress.slice(0, 6)}...${newValidatorAddress.slice(-4)} added successfully`,
            });

            setNewValidatorAddress('');
            await loadRoleHolders();
        } catch (error) {
            console.error('Error adding validator:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to add validator",
                variant: "destructive"
            });
        } finally {
            setProcessing(false);
        }
    };

    const removeValidator = async (validatorAddress) => {
        try {
            setProcessing(true);
            const signer = await getSigner();
            const contract = new ethers.Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, signer);

            const tx = await contract.removeValidator(validatorAddress);

            toast({
                title: "Transaction Submitted",
                description: "Removing validator... Please wait for confirmation.",
            });

            await tx.wait();

            toast({
                title: "Success",
                description: `Validator removed successfully`,
            });

            await loadRoleHolders();
        } catch (error) {
            console.error('Error removing validator:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to remove validator",
                variant: "destructive"
            });
        } finally {
            setProcessing(false);
        }
    };

    const addVerifier = async () => {
        if (!ethers.isAddress(newVerifierAddress)) {
            toast({
                title: "Invalid Address",
                description: "Please enter a valid Ethereum address",
                variant: "destructive"
            });
            return;
        }

        try {
            setProcessing(true);
            const signer = await getSigner();
            const contract = new ethers.Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, signer);

            const tx = await contract.addVerifier(newVerifierAddress);

            toast({
                title: "Transaction Submitted",
                description: "Adding verifier... Please wait for confirmation.",
            });

            await tx.wait();

            toast({
                title: "Success",
                description: `Verifier ${newVerifierAddress.slice(0, 6)}...${newVerifierAddress.slice(-4)} added successfully`,
            });

            setNewVerifierAddress('');
            await loadRoleHolders();
        } catch (error) {
            console.error('Error adding verifier:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to add verifier",
                variant: "destructive"
            });
        } finally {
            setProcessing(false);
        }
    };

    const removeVerifier = async (verifierAddress) => {
        try {
            setProcessing(true);
            const signer = await getSigner();
            const contract = new ethers.Contract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, signer);

            const tx = await contract.removeVerifier(verifierAddress);

            toast({
                title: "Transaction Submitted",
                description: "Removing verifier... Please wait for confirmation.",
            });

            await tx.wait();

            toast({
                title: "Success",
                description: `Verifier removed successfully`,
            });

            await loadRoleHolders();
        } catch (error) {
            console.error('Error removing verifier:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to remove verifier",
                variant: "destructive"
            });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Role Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage validators, verifiers, and view governance owner
                    </p>
                </div>
                <Button onClick={loadRoleHolders} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Governance Owner Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        Governance Owner
                    </CardTitle>
                    <CardDescription>
                        The owner has full control over the governance contract
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <code className="text-sm font-mono">{owner}</code>
                        {isOwner && (
                            <Badge variant="default">You</Badge>
                        )}
                    </div>
                    {!isOwner && walletAddress && (
                        <p className="text-sm text-muted-foreground mt-4">
                            ⚠️ You are not the owner. Only the owner can add/remove validators and verifiers.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Validators and Verifiers Tabs */}
            <Tabs defaultValue="validators" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="validators">
                        <Shield className="h-4 w-4 mr-2" />
                        Validators ({validators.length})
                    </TabsTrigger>
                    <TabsTrigger value="verifiers">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Verifiers ({verifiers.length})
                    </TabsTrigger>
                </TabsList>

                {/* Validators Tab */}
                <TabsContent value="validators" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Authorized Validators</CardTitle>
                            <CardDescription>
                                Validators can validate carbon credit projects (first approval step)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Add Validator Form */}
                            {isOwner && (
                                <div className="border rounded-lg p-4 bg-muted/50">
                                    <Label htmlFor="newValidator" className="text-sm font-medium">
                                        Add New Validator
                                    </Label>
                                    <div className="flex gap-2 mt-2">
                                        <Input
                                            id="newValidator"
                                            placeholder="0x..."
                                            value={newValidatorAddress}
                                            onChange={(e) => setNewValidatorAddress(e.target.value)}
                                            disabled={processing}
                                        />
                                        <Button
                                            onClick={addValidator}
                                            disabled={processing || !newValidatorAddress}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Validators List */}
                            <div className="space-y-2">
                                {validators.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No validators added yet
                                    </p>
                                ) : (
                                    validators.map((validator, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Shield className="h-4 w-4 text-blue-500" />
                                                <code className="text-sm font-mono">{validator}</code>
                                                {walletAddress?.toLowerCase() === validator.toLowerCase() && (
                                                    <Badge variant="outline">You</Badge>
                                                )}
                                            </div>
                                            {isOwner && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeValidator(validator)}
                                                    disabled={processing}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Verifiers Tab */}
                <TabsContent value="verifiers" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Authorized Verifiers</CardTitle>
                            <CardDescription>
                                Verifiers can verify carbon credit projects (second approval step)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Add Verifier Form */}
                            {isOwner && (
                                <div className="border rounded-lg p-4 bg-muted/50">
                                    <Label htmlFor="newVerifier" className="text-sm font-medium">
                                        Add New Verifier
                                    </Label>
                                    <div className="flex gap-2 mt-2">
                                        <Input
                                            id="newVerifier"
                                            placeholder="0x..."
                                            value={newVerifierAddress}
                                            onChange={(e) => setNewVerifierAddress(e.target.value)}
                                            disabled={processing}
                                        />
                                        <Button
                                            onClick={addVerifier}
                                            disabled={processing || !newVerifierAddress}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Verifiers List */}
                            <div className="space-y-2">
                                {verifiers.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No verifiers added yet
                                    </p>
                                ) : (
                                    verifiers.map((verifier, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <UserCheck className="h-4 w-4 text-green-500" />
                                                <code className="text-sm font-mono">{verifier}</code>
                                                {walletAddress?.toLowerCase() === verifier.toLowerCase() && (
                                                    <Badge variant="outline">You</Badge>
                                                )}
                                            </div>
                                            {isOwner && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeVerifier(verifier)}
                                                    disabled={processing}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Role Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Crown className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Governance Owner</p>
                            <p className="text-sm text-muted-foreground">
                                Can add/remove validators and verifiers, approve projects, issue credits
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Validators</p>
                            <p className="text-sm text-muted-foreground">
                                Can validate carbon credit projects (first approval step)
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <UserCheck className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                            <p className="font-medium">Verifiers</p>
                            <p className="text-sm text-muted-foreground">
                                Can verify carbon credit projects (second approval step)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
