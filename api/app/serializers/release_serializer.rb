class ReleaseSerializer < ApplicationSerializer
  fields :id, :status, :clusters

  def id
    model.uid
  end

  def clusters
    model.deploys.map { |deploy| ClusterSerializer.serialize(deploy.cluster).merge(status: deploy.status) }
  end

end
