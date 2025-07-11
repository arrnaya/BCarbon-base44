import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Clock, MessageSquare, Send } from "lucide-react";
import useContractInteraction from '../contract/ContractInteraction';

export default function ProjectValidation({ project }) {
  const { userAddress, validateProject, verifyProject, rejectAndRemoveProject } = useContractInteraction();
  const [comment, setComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [comments, setComments] = React.useState(project.comments.concat(project.offChainComments) || []);

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch(`http://localhost:3001/api/project/${project.projectAddress}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress, comment }),
      });
      const newComment = {
        id: Date.now(),
        author: userAddress,
        content: comment,
        timestamp: new Date().toISOString(),
        type: "general"
      };
      setComments(prev => [newComment, ...prev]);
      setComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      <Alert variant="destructive">
        <AlertDescription>Error submitting comment: {error.message}</AlertDescription>
      </Alert>
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValidation = async (action) => {
    try {
      let hash;
      if (action === 'approve') {
        hash = (await validateProject(project.projectAddress)).hash;
      } else if (action === 'verify') {
        hash = (await verifyProject(project.projectAddress)).hash;
      } else if (action === 'reject') {
        hash = (await rejectAndRemoveProject(project.projectAddress)).hash;
      }
      if (hash) {
        await fetch('http://localhost:3001/api/transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionHash: hash, projectAddress: project.projectAddress, userAddress })
        });
      }
    } catch (error) {
      console.error("Error during validation:", error);
      <Alert variant="destructive">
        <AlertDescription>Error during validation: {error.message}</AlertDescription>
      </Alert>
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending Review" },
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Rejected" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Validation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Validation Status</span>
            {getStatusBadge(project.isApproved ? 'approved' : 'pending')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleValidation('approve')}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Validate Project
            </Button>

            <Button
              onClick={() => handleValidation('verify')}
              variant="outline"
              className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
            >
              <Clock className="w-4 h-4 mr-2" />
              Verify Project
            </Button>

            <Button
              onClick={() => handleValidation('reject')}
              variant="destructive"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject Project
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Validation Comments</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Comment */}
          <div className="space-y-3">
            <Textarea
              placeholder="Add your validation comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !comment.trim()}
              className="w-full sm:w-auto"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Comment"}
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((commentItem) => (
              <div key={commentItem.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{commentItem.author}</span>
                    <Badge variant="outline" className="text-xs">
                      {commentItem.type}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(commentItem.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{commentItem.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}